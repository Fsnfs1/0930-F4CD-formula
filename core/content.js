/**
 * core/content.js
 * Pluggable question type renderer and auto-grader supporting all 7 question types.
 * Pure DOM, zero dependencies, KaTeX / MathJax rendering compliant.
 * Types:
 * 1. single_choice (n選1)
 * 2. multi_select (n選m)
 * 3. matching (集合 n ↔ m 配對)
 * 4. step_order (解答步驟排序)
 * 5. error_find (找錯題：點選錯誤步驟 + 選擇錯誤類型)
 * 6. graph_plot (手指作圖題：點選/拖曳到圖中指定位置)
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
    if (q.type && QuestionTypes._registry[q.type]) return q.type;
    if (q.plotTarget || q.graphImage) return 'graph_plot';
    if (q.errorSteps || q.findError) return 'error_find';
    if (q.steps && Array.isArray(q.steps)) return 'step_order';
    if (q.leftItems && q.rightItems) return 'matching';
    if (q.requireUpload || q.uploadSolution) return 'upload_solution';
    if (Array.isArray(q.correctKeys) && q.correctKeys.length > 1) return 'multi_select';
    if (Array.isArray(q.answer) && q.answer.length > 1) return 'multi_select';
    return 'single_choice';
  }

  function typesetMath(element) {
    if (typeof window !== 'undefined') {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([element]).catch(() => {});
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

  // 1. Single Choice (n 選 1)
  QuestionTypes.register('single_choice', {
    render: function (q, container, ctx) {
      const wrap = document.createElement('div');
      wrap.className = 'q-single-choice';
      const options = q.options || [];
      const userAns = ctx.currentAnswer || '';

      const list = document.createElement('div');
      list.className = 'q-options-list';
      options.forEach(function (opt) {
        const key = opt.key || opt.label;
        const text = opt.text || opt;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'q-opt-btn' + (userAns === key ? ' selected' : '');
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
      const correct = String(q.answer || (q.correctKeys && q.correctKeys[0]) || '').trim().toUpperCase();
      const user = String(ans || '').trim().toUpperCase();
      const isCorrect = user === correct;
      return { isCorrect: isCorrect, score: isCorrect ? (q.points || 1) : 0, correct: correct, user: user };
    }
  });

  // 2. Multi Select (n 選 m)
  QuestionTypes.register('multi_select', {
    render: function (q, container, ctx) {
      const wrap = document.createElement('div');
      wrap.className = 'q-multi-select';
      const options = q.options || [];
      const userAns = Array.isArray(ctx.currentAnswer) ? ctx.currentAnswer.slice() : [];

      const list = document.createElement('div');
      list.className = 'q-options-list';
      options.forEach(function (opt) {
        const key = opt.key || opt.label;
        const text = opt.text || opt;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'q-opt-btn' + (userAns.includes(key) ? ' selected' : '');
        btn.innerHTML = `<span class="opt-key">[${escapeHtml(key)}]</span> <span class="opt-text">${escapeHtml(text)}</span>`;
        if (ctx.disabled) btn.disabled = true;
        btn.onclick = function () {
          if (ctx.disabled) return;
          btn.classList.toggle('selected');
          const idx = userAns.indexOf(key);
          if (idx >= 0) userAns.splice(idx, 1);
          else userAns.push(key);
          userAns.sort();
          if (ctx.onAnswer) ctx.onAnswer(userAns);
        };
        list.appendChild(btn);
      });
      wrap.appendChild(list);
      container.appendChild(wrap);
      return wrap;
    },
    grade: function (q, ans) {
      const rawCorrect = q.correctKeys || (Array.isArray(q.answer) ? q.answer : [q.answer]);
      const correct = rawCorrect.map(k => String(k).trim().toUpperCase()).sort();
      const user = (Array.isArray(ans) ? ans : [ans]).map(k => String(k).trim().toUpperCase()).sort();
      const isCorrect = correct.length === user.length && correct.every((k, i) => k === user[i]);
      return { isCorrect: isCorrect, score: isCorrect ? (q.points || 1) : 0, correct: correct, user: user };
    }
  });

  // 3. Matching (集合 n ↔ m 配對)
  QuestionTypes.register('matching', {
    render: function (q, container, ctx) {
      const wrap = document.createElement('div');
      wrap.className = 'q-matching';
      const leftItems = q.leftItems || [];
      const rightItems = q.rightItems || [];
      const userAns = ctx.currentAnswer || {}; // { "L1": "R2", ... }

      const table = document.createElement('div');
      table.className = 'matching-table';
      leftItems.forEach(function (left, idx) {
        const row = document.createElement('div');
        row.className = 'matching-row';
        const leftLabel = document.createElement('div');
        leftLabel.className = 'matching-left';
        leftLabel.innerHTML = `<strong>${idx + 1}.</strong> ${escapeHtml(left.text || left)}`;

        const select = document.createElement('select');
        select.className = 'matching-select form-select';
        if (ctx.disabled) select.disabled = true;
        select.innerHTML = '<option value="">-- 選擇配對 --</option>' +
          rightItems.map((r, ri) => {
            const rKey = r.key || String.fromCharCode(65 + ri);
            const rText = r.text || r;
            const sel = userAns[left.key || idx] === rKey ? ' selected' : '';
            return `<option value="${escapeHtml(rKey)}"${sel}>${escapeHtml(rKey)}. ${escapeHtml(rText)}</option>`;
          }).join('');

        select.onchange = function () {
          userAns[left.key || idx] = select.value;
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
      const pairs = q.correctPairs || q.pairs || {};
      const user = ans || {};
      let correctCount = 0;
      let total = Object.keys(pairs).length || 1;
      for (const k in pairs) {
        if (String(pairs[k]).trim().toUpperCase() === String(user[k] || '').trim().toUpperCase()) {
          correctCount++;
        }
      }
      const isCorrect = correctCount === total;
      const score = (correctCount / total) * (q.points || 1);
      return { isCorrect: isCorrect, score: Number(score.toFixed(2)), correct: pairs, user: user };
    }
  });

  // 4. Step Order (解答步驟排序題)
  QuestionTypes.register('step_order', {
    render: function (q, container, ctx) {
      const wrap = document.createElement('div');
      wrap.className = 'q-step-order';
      const rawSteps = q.steps || [];
      // Current answer: array of step IDs in ordered sequence
      let currentOrder = Array.isArray(ctx.currentAnswer) && ctx.currentAnswer.length === rawSteps.length
        ? ctx.currentAnswer.slice()
        : rawSteps.map(s => s.id || s.key || s);

      const list = document.createElement('div');
      list.className = 'step-order-list';

      function renderList() {
        list.innerHTML = '';
        currentOrder.forEach((stepId, idx) => {
          const stepObj = rawSteps.find(s => (s.id || s.key || s) === stepId) || { text: stepId };
          const item = document.createElement('div');
          item.className = 'step-order-item';
          item.innerHTML = `
            <div class="step-num">${idx + 1}</div>
            <div class="step-text">${escapeHtml(stepObj.text || stepObj)}</div>
            <div class="step-controls">
              <button type="button" class="btn btn-sm btn-outline-secondary btn-up"${idx === 0 || ctx.disabled ? ' disabled' : ''}>▲</button>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-down"${idx === currentOrder.length - 1 || ctx.disabled ? ' disabled' : ''}>▼</button>
            </div>
          `;
          item.querySelector('.btn-up').onclick = () => {
            if (idx > 0) {
              const tmp = currentOrder[idx - 1];
              currentOrder[idx - 1] = currentOrder[idx];
              currentOrder[idx] = tmp;
              renderList();
              if (ctx.onAnswer) ctx.onAnswer(currentOrder.slice());
            }
          };
          item.querySelector('.btn-down').onclick = () => {
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
      const correct = (q.correctOrder || q.order || []).map(String);
      const user = (Array.isArray(ans) ? ans : []).map(String);
      const isCorrect = correct.length === user.length && correct.every((k, i) => k === user[i]);
      return { isCorrect: isCorrect, score: isCorrect ? (q.points || 1) : 0, correct: correct, user: user };
    }
  });

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
      const userAns = ctx.currentAnswer || { stepIndex: null, errorType: '' };

      const stepList = document.createElement('div');
      stepList.className = 'error-step-list mb-3';
      steps.forEach((step, idx) => {
        const item = document.createElement('div');
        item.className = 'error-step-item' + (userAns.stepIndex === idx ? ' selected-error' : '');
        item.innerHTML = `<span class="badge bg-secondary me-2">步驟 ${idx + 1}</span> <span>${escapeHtml(step.text || step)}</span>`;
        if (!ctx.disabled) {
          item.onclick = () => {
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
      select.onchange = () => {
        userAns.errorType = select.value;
        if (ctx.onAnswer) ctx.onAnswer(Object.assign({}, userAns));
      };
      typeBox.appendChild(select);
      wrap.appendChild(typeBox);

      container.appendChild(wrap);
      return wrap;
    },
    grade: function (q, ans) {
      const targetStep = q.correctErrorStepIndex !== undefined ? q.correctErrorStepIndex : q.errorStepIndex;
      const targetType = String(q.correctErrorType || q.errorType || '').trim();
      const user = ans || {};
      const stepMatch = user.stepIndex === targetStep;
      const typeMatch = !targetType || user.errorType === targetType;
      const isCorrect = stepMatch && typeMatch;
      const score = (stepMatch ? 0.6 : 0) + (typeMatch ? 0.4 : 0);
      return { isCorrect: isCorrect, score: Number(score.toFixed(2)), correct: { step: targetStep, type: targetType }, user: user };
    }
  });

  // 6. Graph Plot (作圖題：在圖中用手指/滑鼠點選或拖曳指定位置)
  QuestionTypes.register('graph_plot', {
    render: function (q, container, ctx) {
      const wrap = document.createElement('div');
      wrap.className = 'q-graph-plot text-center';
      const bgImg = q.graphImage || q.diagram || '';
      const target = q.plotTarget || { x: 0.5, y: 0.5, tolerance: 0.08 }; // relative 0..1
      const userAns = ctx.currentAnswer || null; // { x, y }

      const canvasWrap = document.createElement('div');
      canvasWrap.className = 'plot-canvas-wrapper';
      canvasWrap.style.cssText = 'position:relative; display:inline-block; max-width:100%; border:1px solid #cbd5e1; border-radius:8px; overflow:hidden; touch-action:none;';

      const img = document.createElement('img');
      img.src = bgImg;
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
          const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          const relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
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
      const target = q.plotTarget || { x: 0.5, y: 0.5, tolerance: 0.08 };
      if (!ans || ans.x === undefined) return { isCorrect: false, score: 0, correct: target, user: null };
      const dist = Math.hypot(ans.x - target.x, ans.y - target.y);
      const tol = target.tolerance || 0.08;
      const isCorrect = dist <= tol;
      return { isCorrect: isCorrect, score: isCorrect ? (q.points || 1) : 0, dist: dist, correct: target, user: ans };
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
      preview.className = 'solution-preview mb-2 img-fluid rounded';
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
      return { isCorrect: null, pendingTeacherGrade: true, hasUpload: hasUpload, score: 0, user: ans };
    }
  });

  return {
    QuestionTypes: QuestionTypes,
    detectType: detectType,
    typesetMath: typesetMath
  };
});
