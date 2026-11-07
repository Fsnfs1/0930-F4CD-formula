/**
 * core/content.js
 * Pluggable question type renderer and auto-grader supporting all 7 question types
 * plus seamless compatibility with legacy bank schemas (`ordering`, `plotting`, `single_choice_5`,
 * array-based `pairs: [{left, right}]`, and discrete sequence coordinate grids `targetPoints` / `gridConfig`).
 * Pure DOM, zero dependencies, KaTeX / MathJax rendering compliant.
 * Types:
 * 1. single_choice (n選1, aliases: single_choice_5)
 * 2. multi_select (n選m)
 * 3. matching (集合 n ↔ m 配對, supports both correctPairs map & pairs array)
 * 4. step_order (解答步驟排序, alias: ordering)
 * 5. error_find (找錯題：點選錯誤步驟 + 選擇錯誤類型)
 * 6. graph_plot & plotting (手指作圖題 & 數列/函數離散坐標網格描點題)
 * 7. upload_solution (解答題拍照/手寫上傳)
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MathCoreContent = factory();
    root.QuestionTypes = root.MathCoreContent.QuestionTypes;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window, function () {
  'use strict';

  const QuestionTypes = {
    _registry: {},

    register: function (type, handler) {
      if (!type || !handler || typeof handler.render !== 'function' || typeof handler.grade !== 'function') {
        throw new Error('Invalid QuestionType registration for: ' + type);
      }
      this._registry[type] = handler;
    },

    get: function (type) {
      return this._registry[type] || this._registry['single_choice'];
    },

    render: function (question, container, options) {
      const qType = detectType(question);
      const handler = this.get(qType);
      container.innerHTML = '';
      container.setAttribute('data-qtype', qType);
      const el = handler.render(question, container, options || {});
      typesetMath(container);
      return el;
    },

    grade: function (question, userAnswer) {
      const qType = detectType(question);
      const handler = this.get(qType);
      return handler.grade(question, userAnswer);
    }
  };

  function detectType(q) {
    if (!q) return 'single_choice';
    const rawType = String(q.type || '').trim();
    if (rawType === 'ordering') return 'step_order';
    if (rawType === 'single_choice_5') return 'single_choice';
    if (rawType === 'plotting' || (Array.isArray(q.targetPoints) && q.targetPoints.length > 0) || Array.isArray(q.target_point)) {
      return 'plotting';
    }
    if (rawType && QuestionTypes._registry[rawType]) return rawType;
    if (q.plotTarget || q.graphImage) return 'graph_plot';
    if (q.errorSteps || q.findError) return 'error_find';
    if (q.steps && Array.isArray(q.steps)) return 'step_order';
    if ((q.leftItems && q.rightItems) || (Array.isArray(q.pairs) && q.pairs.length > 0)) return 'matching';
    if (q.requireUpload || q.uploadSolution) return 'upload_solution';
    if (Array.isArray(q.correctKeys) && q.correctKeys.length > 1) return 'multi_select';
    if (Array.isArray(q.answer) && q.answer.length > 1) return 'multi_select';
    return 'single_choice';
  }

  function typesetMath(element) {
    if (typeof window !== 'undefined' && element) {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([element]).catch(function () {});
      } else if (window.renderMathInElement) {
        window.renderMathInElement(element);
      }
    }
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Normalizes matching question schemas:
   * - Schema A (T7_3): `leftItems: [{key:'L1', text:'...'}]`, `rightItems: [{key:'A', text:'...'}]`, `correctPairs: {L1:'B', L2:'A'}`
   * - Schema B (BANK_4CD_T2 & BANK_5BC1102): `pairs: [{left:'...', right:'...'}]`, `leftItems: ['...']`, `rightItems: ['...']`
   */
  function resolveMatchingSpec(q) {
    const rawLeft = Array.isArray(q.leftItems) && q.leftItems.length > 0
      ? q.leftItems
      : (Array.isArray(q.pairs) ? q.pairs.map(p => p.left) : []);

    const leftList = rawLeft.map(function (item, idx) {
      if (item && typeof item === 'object') {
        return { key: String(item.key !== undefined ? item.key : idx), text: String(item.text || '') };
      }
      return { key: String(idx), text: String(item || '') };
    });

    // If `q.correctPairs` is already a plain key-value map (and not an Array)
    if (q.correctPairs && typeof q.correctPairs === 'object' && !Array.isArray(q.correctPairs)) {
      const rawRight = Array.isArray(q.rightItems) ? q.rightItems : [];
      const rightList = rawRight.map(function (r, ri) {
        if (r && typeof r === 'object') {
          return { key: String(r.key || String.fromCharCode(65 + ri)), text: String(r.text || '') };
        }
        return { key: String.fromCharCode(65 + ri), text: String(r || '') };
      });
      const textByRightKey = {};
      rightList.forEach(function (r) {
        textByRightKey[r.key.toUpperCase()] = r.text.trim();
      });
      const expectedKeyMap = {};
      const expectedTextMap = {};
      Object.keys(q.correctPairs).forEach(function (lk) {
        const rk = String(q.correctPairs[lk]).trim().toUpperCase();
        expectedKeyMap[lk] = rk;
        expectedTextMap[lk] = textByRightKey[rk] || rk;
      });
      return {
        leftList: leftList,
        rightList: rightList,
        expectedKeyMap: expectedKeyMap,
        expectedTextMap: expectedTextMap,
        textByRightKey: textByRightKey
      };
    }

    // Schema B: `q.pairs` is an Array of `{ left, right }` objects (or `q.pairs` is an object map)
    if (Array.isArray(q.pairs)) {
      const rawRightTexts = Array.isArray(q.rightItems) && q.rightItems.length > 0
        ? q.rightItems.map(r => (r && typeof r === 'object' ? String(r.text || '') : String(r || '')))
        : q.pairs.map(p => String(p.right || ''));

      // Deduplicate right texts so identical texts (like "異面垂直" in 5BC_MAT02) don't create ambiguous duplicate options
      const uniqueRightTexts = [];
      rawRightTexts.forEach(function (t) {
        const trimmed = t.trim();
        if (uniqueRightTexts.indexOf(trimmed) === -1) {
          uniqueRightTexts.push(trimmed);
        }
      });

      // Deterministic rotation if right options are in the exact same order as pairs (so answers aren't always A, B, C, D)
      if (uniqueRightTexts.length >= 2) {
        const firstLeft = q.pairs[0] && String(q.pairs[0].right || '').trim();
        if (uniqueRightTexts[0] === firstLeft) {
          const shifted = uniqueRightTexts.shift();
          uniqueRightTexts.push(shifted);
        }
      }

      const rightList = uniqueRightTexts.map(function (text, ri) {
        return { key: String.fromCharCode(65 + ri), text: text };
      });

      const keyByRightText = {};
      const textByRightKey = {};
      rightList.forEach(function (r) {
        keyByRightText[r.text.trim()] = r.key;
        textByRightKey[r.key] = r.text.trim();
      });

      const expectedKeyMap = {};
      const expectedTextMap = {};
      leftList.forEach(function (leftObj, idx) {
        const pairObj = q.pairs[idx] || q.pairs.find(p => String(p.left || '').trim() === leftObj.text.trim());
        if (pairObj) {
          const rText = String(pairObj.right || '').trim();
          expectedTextMap[leftObj.key] = rText;
          expectedKeyMap[leftObj.key] = keyByRightText[rText] || rText;
        }
      });

      return {
        leftList: leftList,
        rightList: rightList,
        expectedKeyMap: expectedKeyMap,
        expectedTextMap: expectedTextMap,
        textByRightKey: textByRightKey
      };
    }

    // Fallback when `q.pairs` is a plain object `{ L1: 'B' }`
    const fallbackPairs = (q.pairs && typeof q.pairs === 'object') ? q.pairs : {};
    const rightList = (Array.isArray(q.rightItems) ? q.rightItems : []).map(function (r, ri) {
      if (r && typeof r === 'object') {
        return { key: String(r.key || String.fromCharCode(65 + ri)), text: String(r.text || '') };
      }
      return { key: String.fromCharCode(65 + ri), text: String(r || '') };
    });
    const textByRightKey = {};
    rightList.forEach(function (r) {
      textByRightKey[r.key.toUpperCase()] = r.text.trim();
    });
    const expectedKeyMap = {};
    const expectedTextMap = {};
    Object.keys(fallbackPairs).forEach(function (k) {
      const rk = String(fallbackPairs[k]).trim().toUpperCase();
      expectedKeyMap[k] = rk;
      expectedTextMap[k] = textByRightKey[rk] || rk;
    });
    return {
      leftList: leftList,
      rightList: rightList,
      expectedKeyMap: expectedKeyMap,
      expectedTextMap: expectedTextMap,
      textByRightKey: textByRightKey
    };
  }

  // 1. Single Choice (n 選 1)
  QuestionTypes.register('single_choice', {
    render: function (q, container, ctx) {
      const wrap = document.createElement('div');
      wrap.className = 'q-single-choice';
      const options = q.options || [];
      const rawAns = Array.isArray(ctx.currentAnswer) ? ctx.currentAnswer[0] : ctx.currentAnswer;
      const userAns = String(rawAns || '');

      const list = document.createElement('div');
      list.className = 'q-options-list';
      options.forEach(function (opt, idx) {
        const key = String((opt && (opt.key || opt.label)) || String.fromCharCode(65 + idx));
        const text = (opt && opt.text !== undefined) ? opt.text : opt;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'q-opt-btn' + (userAns === key ? ' selected' : '');
        btn.setAttribute('data-opt-key', key);
        btn.innerHTML = `<span class="opt-key">${escapeHtml(key)}.</span> <span class="opt-text">${escapeHtml(text)}</span>`;
        if (ctx.disabled) btn.disabled = true;
        btn.onclick = function () {
          if (ctx.disabled) return;
          list.querySelectorAll('.q-opt-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          if (ctx.onAnswer) ctx.onAnswer(key);
        };
        list.appendChild(btn);
      });
      wrap.appendChild(list);
      container.appendChild(wrap);
      return wrap;
    },
    grade: function (q, ans) {
      const rawCorrect = Array.isArray(q.answer)
        ? q.answer[0]
        : (q.answer !== undefined && q.answer !== null && q.answer !== ''
            ? q.answer
            : (Array.isArray(q.correctKeys) && q.correctKeys.length > 0 ? q.correctKeys[0] : q.correctAnswer));
      const correct = String(rawCorrect || '').trim().toUpperCase();
      const rawUser = Array.isArray(ans) ? ans[0] : ans;
      const user = String(rawUser || '').trim().toUpperCase();
      const isCorrect = correct !== '' && user === correct;
      return { isCorrect: isCorrect, score: isCorrect ? (q.points || 1) : 0, correct: correct, user: user };
    }
  });
  QuestionTypes.register('single_choice_5', QuestionTypes.get('single_choice'));

  // 2. Multi Select (n 選 m)
  QuestionTypes.register('multi_select', {
    render: function (q, container, ctx) {
      const wrap = document.createElement('div');
      wrap.className = 'q-multi-select';
      const options = q.options || [];
      const userAns = Array.isArray(ctx.currentAnswer) ? ctx.currentAnswer.slice() : [];

      const list = document.createElement('div');
      list.className = 'q-options-list';
      options.forEach(function (opt, idx) {
        const key = String((opt && (opt.key || opt.label)) || String.fromCharCode(65 + idx));
        const text = (opt && opt.text !== undefined) ? opt.text : opt;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'q-opt-btn' + (userAns.includes(key) ? ' selected' : '');
        btn.setAttribute('data-opt-key', key);
        btn.innerHTML = `<span class="opt-key">[${escapeHtml(key)}]</span> <span class="opt-text">${escapeHtml(text)}</span>`;
        if (ctx.disabled) btn.disabled = true;
        btn.onclick = function () {
          if (ctx.disabled) return;
          btn.classList.toggle('selected');
          const pos = userAns.indexOf(key);
          if (pos >= 0) userAns.splice(pos, 1);
          else userAns.push(key);
          userAns.sort();
          if (ctx.onAnswer) ctx.onAnswer(userAns.slice());
        };
        list.appendChild(btn);
      });
      wrap.appendChild(list);
      container.appendChild(wrap);
      return wrap;
    },
    grade: function (q, ans) {
      const rawCorrect = (Array.isArray(q.correctKeys) && q.correctKeys.length > 0)
        ? q.correctKeys
        : (Array.isArray(q.answer) ? q.answer : (Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.answer || q.correctAnswer]));
      const correct = rawCorrect.filter(Boolean).map(k => String(k).trim().toUpperCase()).sort();
      const user = (Array.isArray(ans) ? ans : (ans ? [ans] : [])).filter(Boolean).map(k => String(k).trim().toUpperCase()).sort();
      const isCorrect = correct.length > 0 && correct.length === user.length && correct.every((k, i) => k === user[i]);
      return { isCorrect: isCorrect, score: isCorrect ? (q.points || 1) : 0, correct: correct, user: user };
    }
  });

  // 3. Matching (集合 n ↔ m 配對)
  QuestionTypes.register('matching', {
    render: function (q, container, ctx) {
      const wrap = document.createElement('div');
      wrap.className = 'q-matching';
      const spec = resolveMatchingSpec(q);
      const userAns = (ctx.currentAnswer && typeof ctx.currentAnswer === 'object' && !Array.isArray(ctx.currentAnswer))
        ? Object.assign({}, ctx.currentAnswer)
        : {};

      const table = document.createElement('div');
      table.className = 'matching-table';
      spec.leftList.forEach(function (left, idx) {
        const row = document.createElement('div');
        row.className = 'matching-row';
        const leftLabel = document.createElement('div');
        leftLabel.className = 'matching-left';
        leftLabel.innerHTML = `<strong>${idx + 1}.</strong> ${escapeHtml(left.text)}`;

        const select = document.createElement('select');
        select.className = 'matching-select form-select';
        select.setAttribute('data-left-key', left.key);
        if (ctx.disabled) select.disabled = true;
        select.innerHTML = '<option value="">-- 選擇配對 --</option>' +
          spec.rightList.map(function (r) {
            const sel = userAns[left.key] === r.key ? ' selected' : '';
            return `<option value="${escapeHtml(r.key)}"${sel}>${escapeHtml(r.key)}. ${escapeHtml(r.text)}</option>`;
          }).join('');

        select.onchange = function () {
          userAns[left.key] = select.value;
          if (ctx.onAnswer) ctx.onAnswer(Object.assign({}, userAns));
        };

        row.appendChild(leftLabel);
        row.appendChild(select);
        table.appendChild(row);
      });
      wrap.appendChild(table);
      container.appendChild(wrap);
      return wrap;
    },
    grade: function (q, ans) {
      const spec = resolveMatchingSpec(q);
      const user = (ans && typeof ans === 'object' && !Array.isArray(ans)) ? ans : {};
      const keys = Object.keys(spec.expectedKeyMap);
      const total = keys.length || 1;
      let correctCount = 0;

      keys.forEach(function (lk) {
        const expectedKey = String(spec.expectedKeyMap[lk] || '').trim().toUpperCase();
        const expectedText = String(spec.expectedTextMap[lk] || '').trim();
        const rawUserVal = user[lk] !== undefined ? user[lk] : user['L' + lk];
        const userVal = String(rawUserVal !== undefined ? rawUserVal : '').trim();
        const userValUpper = userVal.toUpperCase();
        const selectedRightText = spec.textByRightKey[userValUpper] || '';

        if (userValUpper && (userValUpper === expectedKey || userVal === expectedText || (expectedText && selectedRightText === expectedText))) {
          correctCount++;
        }
      });

      const isCorrect = keys.length > 0 && correctCount === total;
      const score = (correctCount / total) * (q.points || 1);
      return {
        isCorrect: isCorrect,
        score: Number(score.toFixed(2)),
        correct: spec.expectedKeyMap,
        correctTextMap: spec.expectedTextMap,
        user: user
      };
    }
  });

  // 4. Step Order (解答步驟排序題, alias: ordering)
  QuestionTypes.register('step_order', {
    render: function (q, container, ctx) {
      const wrap = document.createElement('div');
      wrap.className = 'q-step-order';
      const rawSteps = Array.isArray(q.steps) ? q.steps : [];
      const stepIds = rawSteps.map(function (s, idx) {
        return String(s && s.id !== undefined ? s.id : (s && s.key !== undefined ? s.key : (typeof s === 'object' ? idx + 1 : s)));
      });
      const correctOrder = (q.correctOrder || q.order || []).map(String);

      let currentOrder;
      if (Array.isArray(ctx.currentAnswer) && ctx.currentAnswer.length === rawSteps.length) {
        currentOrder = ctx.currentAnswer.map(String);
      } else {
        currentOrder = stepIds.slice();
        // If rawSteps in bank are pre-sorted in exact correctOrder, deterministically rotate so student sees a real ordering puzzle
        if (
          currentOrder.length >= 2 &&
          correctOrder.length === currentOrder.length &&
          currentOrder.every((id, i) => id === correctOrder[i])
        ) {
          currentOrder.push(currentOrder.shift());
        }
      }

      // Immediately notify ctx.onAnswer so currentDraftAnswer is initialized even without clicking ▲/▼
      if (ctx.onAnswer) {
        ctx.onAnswer(currentOrder.slice());
      }

      const list = document.createElement('div');
      list.className = 'step-order-list';

      function renderList() {
        list.innerHTML = '';
        currentOrder.forEach(function (stepId, idx) {
          const stepObj = rawSteps.find(function (s, sIdx) {
            const sid = String(s && s.id !== undefined ? s.id : (s && s.key !== undefined ? s.key : (typeof s === 'object' ? sIdx + 1 : s)));
            return sid === String(stepId);
          }) || { text: stepId };
          const item = document.createElement('div');
          item.className = 'step-order-item';
          item.setAttribute('data-step-id', String(stepId));
          item.innerHTML = `
            <div class="step-num badge bg-secondary me-2">${idx + 1}</div>
            <div class="step-text flex-grow-1">${escapeHtml(stepObj.text !== undefined ? stepObj.text : stepObj)}</div>
            <div class="step-controls d-flex gap-1">
              <button type="button" class="btn btn-sm btn-outline-secondary btn-up"${idx === 0 || ctx.disabled ? ' disabled' : ''}>▲</button>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-down"${idx === currentOrder.length - 1 || ctx.disabled ? ' disabled' : ''}>▼</button>
            </div>
          `;
          item.querySelector('.btn-up').onclick = function () {
            if (idx > 0) {
              const tmp = currentOrder[idx - 1];
              currentOrder[idx - 1] = currentOrder[idx];
              currentOrder[idx] = tmp;
              renderList();
              if (ctx.onAnswer) ctx.onAnswer(currentOrder.slice());
            }
          };
          item.querySelector('.btn-down').onclick = function () {
            if (idx < currentOrder.length - 1) {
              const tmp = currentOrder[idx + 1];
              currentOrder[idx + 1] = currentOrder[idx];
              currentOrder[idx] = tmp;
              renderList();
              if (ctx.onAnswer) ctx.onAnswer(currentOrder.slice());
            }
          };
          list.appendChild(item);
        });
        typesetMath(list);
      }

      renderList();
      wrap.appendChild(list);
      container.appendChild(wrap);
      return wrap;
    },
    grade: function (q, ans) {
      const rawCorrect = q.correctOrder || q.order || (Array.isArray(q.correctAnswer) ? q.correctAnswer : (Array.isArray(q.answer) ? q.answer : []));
      const correct = rawCorrect.map(String);
      const user = (Array.isArray(ans) ? ans : []).map(String);
      const isCorrect = correct.length > 0 && correct.length === user.length && correct.every((k, i) => k === user[i]);
      return { isCorrect: isCorrect, score: isCorrect ? (q.points || 1) : 0, correct: correct, user: user };
    }
  });
  QuestionTypes.register('ordering', QuestionTypes.get('step_order'));

  // 5. Error Find (指出解答過程中的錯誤點及錯誤類型)
  QuestionTypes.register('error_find', {
    render: function (q, container, ctx) {
      const wrap = document.createElement('div');
      wrap.className = 'q-error-find';
      const steps = q.errorSteps || q.solutionSteps || [];
      const errorTypes = q.errorTypeOptions || [
        '計算錯誤 (運算失誤)',
        '概念錯誤 (定理或公式用錯)',
        '符號錯誤 (正負號/移項錯誤)',
        '遺漏定義域或限制條件',
        '推導邏輯偷換/不充分'
      ];
      const userAns = (ctx.currentAnswer && typeof ctx.currentAnswer === 'object')
        ? Object.assign({}, ctx.currentAnswer)
        : { stepIndex: null, errorType: '' };

      const stepList = document.createElement('div');
      stepList.className = 'error-step-list mb-3';
      steps.forEach(function (step, idx) {
        const item = document.createElement('div');
        item.className = 'error-step-item' + (userAns.stepIndex === idx ? ' selected-error' : '');
        item.innerHTML = `<span class="badge bg-secondary me-2">步驟 ${idx + 1}</span> <span>${escapeHtml(step.text || step)}</span>`;
        if (!ctx.disabled) {
          item.onclick = function () {
            stepList.querySelectorAll('.error-step-item').forEach(el => el.classList.remove('selected-error'));
            item.classList.add('selected-error');
            userAns.stepIndex = idx;
            if (ctx.onAnswer) ctx.onAnswer(Object.assign({}, userAns));
          };
        }
        stepList.appendChild(item);
      });
      wrap.appendChild(stepList);

      const typeBox = document.createElement('div');
      typeBox.className = 'error-type-selector mt-2';
      typeBox.innerHTML = '<label class="form-label fw-bold">指出該步驟的錯誤類型：</label>';
      const select = document.createElement('select');
      select.className = 'form-select';
      if (ctx.disabled) select.disabled = true;
      select.innerHTML = '<option value="">-- 請選擇錯誤類型 --</option>' +
        errorTypes.map(t => `<option value="${escapeHtml(t)}"${userAns.errorType === t ? ' selected' : ''}>${escapeHtml(t)}</option>`).join('');
      select.onchange = function () {
        userAns.errorType = select.value;
        if (ctx.onAnswer) ctx.onAnswer(Object.assign({}, userAns));
      };
      typeBox.appendChild(select);
      wrap.appendChild(typeBox);

      container.appendChild(wrap);
      return wrap;
    },
    grade: function (q, ans) {
      const targetStep = q.correctErrorStepIndex !== undefined
        ? q.correctErrorStepIndex
        : (q.errorStepIndex !== undefined ? q.errorStepIndex : (q.correctAnswer && q.correctAnswer.step));
      const targetType = String(q.correctErrorType || q.errorType || (q.correctAnswer && q.correctAnswer.type) || '').trim();
      const user = ans || {};
      const stepMatch = user.stepIndex === targetStep;
      const typeMatch = !targetType || user.errorType === targetType || user.errorType.includes(targetType) || targetType.includes(user.errorType || '___');
      const isCorrect = stepMatch && typeMatch;
      const score = (stepMatch ? 0.6 : 0) + (typeMatch ? 0.4 : 0);
      return { isCorrect: isCorrect, score: Number(score.toFixed(2)), correct: { step: targetStep, type: targetType }, user: user };
    }
  });

  // 6a. Graph Plot (圖像相對坐標點選作圖題: plotTarget { x, y, tolerance })
  QuestionTypes.register('graph_plot', {
    render: function (q, container, ctx) {
      const wrap = document.createElement('div');
      wrap.className = 'q-graph-plot text-center';
      const bgImg = q.graphImage || q.diagram || '';
      const userAns = ctx.currentAnswer || null;

      const canvasWrap = document.createElement('div');
      canvasWrap.className = 'plot-canvas-wrapper';
      canvasWrap.style.cssText = 'position:relative; display:inline-block; max-width:100%; min-width:260px; min-height:180px; border:1px solid #cbd5e1; border-radius:8px; overflow:hidden; touch-action:none; background:#f8fafc; cursor:crosshair;';

      const img = document.createElement('img');
      img.src = bgImg;
      img.alt = '作圖區';
      img.style.cssText = 'display:block; max-width:100%; height:auto; user-select:none; pointer-events:none;';
      canvasWrap.appendChild(img);

      const marker = document.createElement('div');
      marker.className = 'plot-marker';
      marker.style.cssText = 'position:absolute; width:20px; height:20px; border-radius:50%; background:#ef4444; border:3px solid #ffffff; transform:translate(-50%,-50%); box-shadow:0 0 8px rgba(0,0,0,0.4); display:none; pointer-events:none;';
      canvasWrap.appendChild(marker);

      function updateMarker(relX, relY) {
        marker.style.left = (relX * 100) + '%';
        marker.style.top = (relY * 100) + '%';
        marker.style.display = 'block';
      }

      if (userAns && userAns.x !== undefined && userAns.y !== undefined) {
        updateMarker(userAns.x, userAns.y);
      }

      if (!ctx.disabled) {
        canvasWrap.addEventListener('pointerdown', function (e) {
          const rect = canvasWrap.getBoundingClientRect();
          const w = rect.width || 300;
          const h = rect.height || 200;
          const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / w));
          const relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / h));
          updateMarker(relX, relY);
          const pos = { x: Number(relX.toFixed(4)), y: Number(relY.toFixed(4)) };
          if (ctx.onAnswer) ctx.onAnswer(pos);
        });
      }

      wrap.appendChild(canvasWrap);
      const tip = document.createElement('div');
      tip.className = 'text-muted small mt-2';
      tip.textContent = '👆 請用手指或點擊在圖中標註目標位置';
      wrap.appendChild(tip);

      container.appendChild(wrap);
      return wrap;
    },
    grade: function (q, ans) {
      const target = q.plotTarget || (q.correctAnswer && q.correctAnswer.x !== undefined ? q.correctAnswer : { x: 0.5, y: 0.5, tolerance: 0.08 });
      if (!ans || ans.x === undefined) return { isCorrect: false, score: 0, correct: target, user: null };
      const dist = Math.hypot(ans.x - target.x, ans.y - target.y);
      const tol = target.tolerance || 0.08;
      const isCorrect = dist <= tol;
      return { isCorrect: isCorrect, score: isCorrect ? (q.points || 1) : 0, dist: dist, correct: target, user: ans };
    }
  });

  // 6b. Discrete Sequence / Coordinate Grid Plotting (`type: 'plotting'`, used in 5BC_PLT01, 5BC_PLT02, P31, P36)
  function extractTargetPoints(q) {
    if (Array.isArray(q.targetPoints) && q.targetPoints.length > 0) {
      return q.targetPoints.map(function (pt) {
        const xVal = pt.n !== undefined ? Number(pt.n) : Number(pt.x);
        const yVal = pt.an !== undefined ? Number(pt.an) : Number(pt.y);
        return { n: xVal, an: yVal, label: pt.label || `(${xVal}, ${yVal})` };
      });
    }
    if (Array.isArray(q.target_point) && q.target_point.length >= 2) {
      const xVal = Number(q.target_point[0]);
      const yVal = Number(q.target_point[1]);
      return [{ n: xVal, an: yVal, label: q.targetPoint || `(${xVal}, ${yVal})` }];
    }
    if (q.coordinates && q.coordinates.x !== undefined && q.coordinates.y !== undefined) {
      const xVal = Number(q.coordinates.x);
      const yVal = Number(q.coordinates.y);
      return [{ n: xVal, an: yVal, label: `(${xVal}, ${yVal})` }];
    }
    return [{ n: 1, an: 1, label: '(1, 1)' }];
  }

  QuestionTypes.register('plotting', {
    render: function (q, container, ctx) {
      const wrap = document.createElement('div');
      wrap.className = 'q-plotting';
      const targets = extractTargetPoints(q);
      const cfg = q.gridConfig || { minN: -1, maxN: 5, minY: -3, maxY: 5, stepN: 1, stepY: 1 };
      const minX = cfg.minN !== undefined ? Number(cfg.minN) : (cfg.minX !== undefined ? Number(cfg.minX) : 1);
      const maxX = cfg.maxN !== undefined ? Number(cfg.maxN) : (cfg.maxX !== undefined ? Number(cfg.maxX) : 5);
      const minY = cfg.minY !== undefined ? Number(cfg.minY) : -3;
      const maxY = cfg.maxY !== undefined ? Number(cfg.maxY) : 5;

      let selectedPoints = Array.isArray(ctx.currentAnswer) ? ctx.currentAnswer.slice() : [];

      const infoBar = document.createElement('div');
      infoBar.className = 'mb-2 small fw-semibold text-primary';
      function updateInfoText() {
        const labels = selectedPoints
          .slice()
          .sort((a, b) => a.n - b.n)
          .map(p => `(${p.n}, ${p.an})`);
        infoBar.textContent = labels.length > 0
          ? `📍 已描點 (${labels.length}/${targets.length})：${labels.join(' , ')}`
          : `👆 請點擊下方坐標網格描出目標點（共需描出 ${targets.length} 個點）`;
      }
      updateInfoText();
      wrap.appendChild(infoBar);

      // Build interactive coordinate grid table
      const gridWrap = document.createElement('div');
      gridWrap.className = 'table-responsive mb-2';
      const table = document.createElement('table');
      table.className = 'table table-bordered table-sm text-center align-middle mb-0';
      table.style.maxWidth = '520px';

      const tbody = document.createElement('tbody');
      for (let y = maxY; y >= minY; y--) {
        const tr = document.createElement('tr');
        const yHeader = document.createElement('th');
        yHeader.className = 'bg-light small text-muted';
        yHeader.style.width = '48px';
        yHeader.textContent = `y=${y}`;
        tr.appendChild(yHeader);

        for (let x = minX; x <= maxX; x++) {
          const td = document.createElement('td');
          td.style.padding = '4px';
          const btn = document.createElement('button');
          btn.type = 'button';
          const isSel = selectedPoints.some(p => Number(p.n) === x && Number(p.an) === y);
          btn.className = 'btn btn-sm w-100 ' + (isSel ? 'btn-danger fw-bold' : 'btn-outline-secondary');
          btn.setAttribute('data-coord', `${x},${y}`);
          btn.style.fontSize = '12px';
          btn.textContent = isSel ? `● (${x},${y})` : `(${x},${y})`;
          if (ctx.disabled) btn.disabled = true;

          btn.onclick = function () {
            if (ctx.disabled) return;
            const existingIdx = selectedPoints.findIndex(p => Number(p.n) === x && Number(p.an) === y);
            if (existingIdx >= 0) {
              selectedPoints.splice(existingIdx, 1);
            } else if (targets.length === 1) {
              selectedPoints = [{ n: x, an: y }];
            } else {
              // Replace any existing point with the same x (n) so sequence plotting is 1-click per n
              const sameNIdx = selectedPoints.findIndex(p => Number(p.n) === x);
              if (sameNIdx >= 0) selectedPoints.splice(sameNIdx, 1);
              selectedPoints.push({ n: x, an: y });
            }
            // Refresh button states
            tbody.querySelectorAll('button[data-coord]').forEach(function (b) {
              const parts = b.getAttribute('data-coord').split(',');
              const bx = Number(parts[0]);
              const by = Number(parts[1]);
              const active = selectedPoints.some(p => Number(p.n) === bx && Number(p.an) === by);
              b.className = 'btn btn-sm w-100 ' + (active ? 'btn-danger fw-bold' : 'btn-outline-secondary');
              b.textContent = active ? `● (${bx},${by})` : `(${bx},${by})`;
            });
            updateInfoText();
            if (ctx.onAnswer) ctx.onAnswer(selectedPoints.slice());
          };

          td.appendChild(btn);
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      }

      // X-axis footer row
      const tfoot = document.createElement('tfoot');
      const footTr = document.createElement('tr');
      footTr.className = 'bg-light small text-muted';
      const cornerTh = document.createElement('th');
      cornerTh.textContent = 'y \\ x';
      footTr.appendChild(cornerTh);
      for (let x = minX; x <= maxX; x++) {
        const xTh = document.createElement('th');
        xTh.textContent = `x=${x}`;
        footTr.appendChild(xTh);
      }
      tfoot.appendChild(footTr);

      table.appendChild(tbody);
      table.appendChild(tfoot);
      gridWrap.appendChild(table);
      wrap.appendChild(gridWrap);

      container.appendChild(wrap);
      return wrap;
    },
    grade: function (q, ans) {
      const targets = extractTargetPoints(q);
      // Also allow grading if user answered via option key (for hybrid questions P31/P36)
      if (typeof ans === 'string' && q.options && q.options.length > 0 && !ans.includes(',')) {
        return QuestionTypes.get('single_choice').grade(q, ans);
      }
      const rawPts = Array.isArray(ans)
        ? ans
        : (ans && ans.x !== undefined && ans.y !== undefined ? [{ n: Number(ans.x), an: Number(ans.y) }] : []);

      const userPts = rawPts.map(function (u) {
        if (typeof u === 'string' && u.includes(',')) {
          const p = u.split(',');
          return { n: Number(p[0]), an: Number(p[1]) };
        }
        if (Array.isArray(u) && u.length >= 2) {
          return { n: Number(u[0]), an: Number(u[1]) };
        }
        if (u && typeof u === 'object') {
          return {
            n: Number(u.n !== undefined ? u.n : u.x),
            an: Number(u.an !== undefined ? u.an : u.y)
          };
        }
        return { n: NaN, an: NaN };
      });

      let matched = 0;
      targets.forEach(function (t) {
        const hit = userPts.some(function (u) {
          return u.n === t.n && u.an === t.an;
        });
        if (hit) matched++;
      });

      const isCorrect = targets.length > 0 && userPts.length === targets.length && matched === targets.length;
      const ratio = targets.length > 0 ? matched / targets.length : 0;
      return {
        isCorrect: isCorrect,
        score: Number((ratio * (q.points || 1)).toFixed(2)),
        correct: targets.map(t => t.label || `(${t.n}, ${t.an})`),
        user: userPts
      };
    }
  });

  // 7. Upload Solution (解答題拍照/手寫上傳題)
  QuestionTypes.register('upload_solution', {
    render: function (q, container, ctx) {
      const wrap = document.createElement('div');
      wrap.className = 'q-upload-solution';
      const userAns = ctx.currentAnswer || { imageBase64: '', fileId: '', uploadedAt: null };

      const box = document.createElement('div');
      box.className = 'upload-box p-3 border rounded text-center bg-light';

      const preview = document.createElement('img');
      preview.className = 'solution-preview mb-2 img-fluid rounded mx-auto';
      preview.style.maxHeight = '240px';
      preview.style.display = userAns.imageBase64 ? 'block' : 'none';
      if (userAns.imageBase64) preview.src = userAns.imageBase64;

      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.capture = 'environment';
      fileInput.className = 'form-control mt-2';
      if (ctx.disabled) fileInput.disabled = true;

      fileInput.onchange = function (e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (ev) {
          const b64 = ev.target.result;
          preview.src = b64;
          preview.style.display = 'block';
          const ans = { imageBase64: b64, fileName: file.name, uploadedAt: Date.now() };
          if (ctx.onAnswer) ctx.onAnswer(ans);
        };
        reader.readAsDataURL(file);
      };

      box.appendChild(preview);
      box.appendChild(document.createTextNode('📷 拍照上傳解答過程或手寫草稿：'));
      box.appendChild(fileInput);
      wrap.appendChild(box);

      container.appendChild(wrap);
      return wrap;
    },
    grade: function (q, ans) {
      // Manual grading required by teacher in A9 Teacher Console
      const hasUpload = !!(ans && ans.imageBase64);
      return {
        isCorrect: null,
        pendingTeacherGrade: true,
        hasUpload: hasUpload,
        score: 0,
        correct: '待教師批改',
        user: ans
      };
    }
  });

  return {
    QuestionTypes: QuestionTypes,
    detectType: detectType,
    typesetMath: typesetMath,
    resolveMatchingSpec: resolveMatchingSpec
  };
});
