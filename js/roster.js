/**
 * roster.js - High School Student Directory and Grade Routing Module
 * High School Mobile Math Practice & Anti-Cheating Quiz Platform
 * 
 * Source: D:\2627\WEB+\StudentID.txt
 * Total: 88 students
 * - 4C: 29 students (IDs: 1..12, 14..30; NOTE: Student #13 does NOT exist)
 * - 4D: 31 students (IDs: 1..31)
 * - 5B: 28 students (IDs: 1..28)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.RosterModule = factory();
    // Also expose top-level globals for direct browser script tags
    root.ROSTER_DATA = root.RosterModule.ROSTER_DATA;
    root.getRoster = root.RosterModule.getRoster;
    root.getStudent = root.RosterModule.getStudent;
    root.getStudentsByClass = root.RosterModule.getStudentsByClass;
    root.getStudentName = root.RosterModule.getStudentName;
    root.getGradeByClass = root.RosterModule.getGradeByClass;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Complete student directory mapping by class
   */
  const ROSTER_DATA = {
    "4C": [
      { id: 1, name: "古永晴", grade: 10, classID: "4C" },
      { id: 2, name: "王嘉熙", grade: 10, classID: "4C" },
      { id: 3, name: "宋榛", grade: 10, classID: "4C" },
      { id: 4, name: "周子謙", grade: 10, classID: "4C" },
      { id: 5, name: "李藝彤", grade: 10, classID: "4C" },
      { id: 6, name: "谷雨", grade: 10, classID: "4C" },
      { id: 7, name: "冼周蔚", grade: 10, classID: "4C" },
      { id: 8, name: "林國榮", grade: 10, classID: "4C" },
      { id: 9, name: "林晨欣", grade: 10, classID: "4C" },
      { id: 10, name: "徐浟", grade: 10, classID: "4C" },
      { id: 11, name: "曹爵先", grade: 10, classID: "4C" },
      { id: 12, name: "梁寶娟", grade: 10, classID: "4C" },
      // CRITICAL: Student #13 is intentionally omitted (absent from 4C)
      { id: 14, name: "莫芷瑤", grade: 10, classID: "4C" },
      { id: 15, name: "陳子豪", grade: 10, classID: "4C" },
      { id: 16, name: "陳心怡", grade: 10, classID: "4C" },
      { id: 17, name: "陳芷澄", grade: 10, classID: "4C" },
      { id: 18, name: "陳穎彤", grade: 10, classID: "4C" },
      { id: 19, name: "陸恩希", grade: 10, classID: "4C" },
      { id: 20, name: "麥曉楠", grade: 10, classID: "4C" },
      { id: 21, name: "溫愛嫦", grade: 10, classID: "4C" },
      { id: 22, name: "葉峰", grade: 10, classID: "4C" },
      { id: 23, name: "趙政熹", grade: 10, classID: "4C" },
      { id: 24, name: "劉卓盈", grade: 10, classID: "4C" },
      { id: 25, name: "蔡清琰", grade: 10, classID: "4C" },
      { id: 26, name: "謝嘉瑩", grade: 10, classID: "4C" },
      { id: 27, name: "譚梓鈞", grade: 10, classID: "4C" },
      { id: 28, name: "譚志坤", grade: 10, classID: "4C" },
      { id: 29, name: "譚欣", grade: 10, classID: "4C" },
      { id: 30, name: "羅清璋", grade: 10, classID: "4C" }
    ],
    "4D": [
      { id: 1, name: "洪佳佳", grade: 10, classID: "4D" },
      { id: 2, name: "王偉德", grade: 10, classID: "4D" },
      { id: 3, name: "王煜鑫", grade: 10, classID: "4D" },
      { id: 4, name: "甘俊誠", grade: 10, classID: "4D" },
      { id: 5, name: "余浩賢", grade: 10, classID: "4D" },
      { id: 6, name: "李青霞", grade: 10, classID: "4D" },
      { id: 7, name: "李語鵑", grade: 10, classID: "4D" },
      { id: 8, name: "李樂瞳", grade: 10, classID: "4D" },
      { id: 9, name: "李穎欣", grade: 10, classID: "4D" },
      { id: 10, name: "李臻斌", grade: 10, classID: "4D" },
      { id: 11, name: "周梓霖", grade: 10, classID: "4D" },
      { id: 12, name: "林川雲", grade: 10, classID: "4D" },
      { id: 13, name: "施舒晨", grade: 10, classID: "4D" },
      { id: 14, name: "徐芷瑤", grade: 10, classID: "4D" },
      { id: 15, name: "翁淮洋", grade: 10, classID: "4D" },
      { id: 16, name: "馬雨彤", grade: 10, classID: "4D" },
      { id: 17, name: "張博聰", grade: 10, classID: "4D" },
      { id: 18, name: "曾浚恩", grade: 10, classID: "4D" },
      { id: 19, name: "黃悅軒", grade: 10, classID: "4D" },
      { id: 20, name: "黃梓建", grade: 10, classID: "4D" },
      { id: 21, name: "黃嫣然", grade: 10, classID: "4D" },
      { id: 22, name: "董清霞", grade: 10, classID: "4D" },
      { id: 23, name: "劉付穎", grade: 10, classID: "4D" },
      { id: 24, name: "劉泳欣", grade: 10, classID: "4D" },
      { id: 25, name: "鄭佩芝", grade: 10, classID: "4D" },
      { id: 26, name: "鄭東沅", grade: 10, classID: "4D" },
      { id: 27, name: "盧肇琪", grade: 10, classID: "4D" },
      { id: 28, name: "賴君華", grade: 10, classID: "4D" },
      { id: 29, name: "譚佩泳", grade: 10, classID: "4D" },
      { id: 30, name: "鄭梓浩", grade: 10, classID: "4D" },
      { id: 31, name: "鄭國樺", grade: 10, classID: "4D" }
    ],
    "5B": [
      { id: 1, name: "吳鎂澄", grade: 11, classID: "5B" },
      { id: 2, name: "蘇子恩", grade: 11, classID: "5B" },
      { id: 3, name: "李潤歌", grade: 11, classID: "5B" },
      { id: 4, name: "李曉熹", grade: 11, classID: "5B" },
      { id: 5, name: "周鈺燕", grade: 11, classID: "5B" },
      { id: 6, name: "林煜皓", grade: 11, classID: "5B" },
      { id: 7, name: "林穎豪", grade: 11, classID: "5B" },
      { id: 8, name: "柯鈺鑫", grade: 11, classID: "5B" },
      { id: 9, name: "洪泳棋", grade: 11, classID: "5B" },
      { id: 10, name: "高尚禮", grade: 11, classID: "5B" },
      { id: 11, name: "張啟赫", grade: 11, classID: "5B" },
      { id: 12, name: "張嘉城", grade: 11, classID: "5B" },
      { id: 13, name: "梁泳心", grade: 11, classID: "5B" },
      { id: 14, name: "梁芷韻", grade: 11, classID: "5B" },
      { id: 15, name: "梁偉烽", grade: 11, classID: "5B" },
      { id: 16, name: "姚皓然", grade: 11, classID: "5B" },
      { id: 17, name: "陳施攸", grade: 11, classID: "5B" },
      { id: 18, name: "陳柏琳", grade: 11, classID: "5B" },
      { id: 19, name: "陳國良", grade: 11, classID: "5B" },
      { id: 20, name: "陳紫涵", grade: 11, classID: "5B" },
      { id: 21, name: "陳鑫源", grade: 11, classID: "5B" },
      { id: 22, name: "彭婷婷", grade: 11, classID: "5B" },
      { id: 23, name: "黃少彬", grade: 11, classID: "5B" },
      { id: 24, name: "黃卓琳", grade: 11, classID: "5B" },
      { id: 25, name: "黃婉瑜", grade: 11, classID: "5B" },
      { id: 26, name: "葉棨釗", grade: 11, classID: "5B" },
      { id: 27, name: "潘子聰", grade: 11, classID: "5B" },
      { id: 28, name: "黎宛旻", grade: 11, classID: "5B" }
    ]
  };

  /**
   * Return the entire flat roster of all 88 students
   * @returns {Array<{classID: string, studentID: number, id: number, name: string, grade: number}>}
   */
  function getRoster() {
    const list = [];
    Object.keys(ROSTER_DATA).forEach(function (cls) {
      ROSTER_DATA[cls].forEach(function (s) {
        list.push({
          classID: cls,
          studentID: s.id,
          id: s.id,
          name: s.name,
          grade: s.grade
        });
      });
    });
    return list;
  }

  /**
   * Retrieve student list for a given class ID (4C, 4D, 5B)
   * @param {string} classID 
   * @returns {Array<{id: number, name: string, grade: number, classID: string}>}
   */
  function getStudentsByClass(classID) {
    if (!classID) return [];
    const normalized = String(classID).trim().toUpperCase();
    return ROSTER_DATA[normalized] ? ROSTER_DATA[normalized].slice() : [];
  }

  /**
   * Lookup a single student by class and student ID
   * @param {string} classID 
   * @param {number|string} studentID 
   * @returns {Object|null}
   */
  function getStudent(classID, studentID) {
    if (!classID || studentID === undefined || studentID === null) return null;
    const list = getStudentsByClass(classID);
    const targetId = parseInt(studentID, 10);
    const student = list.find(function (s) {
      return s.id === targetId;
    });
    if (!student) return null;
    return {
      classID: student.classID,
      studentID: student.id,
      id: student.id,
      name: student.name,
      grade: student.grade
    };
  }

  /**
   * Lookup student name by class and student ID
   * @param {string} classID 
   * @param {number|string} studentID 
   * @returns {string}
   */
  function getStudentName(classID, studentID) {
    const s = getStudent(classID, studentID);
    return s ? s.name : "";
  }

  /**
   * Determine grade and question bank key by class ID
   * 4C, 4D -> Grade 10 (高一, bank: GRADE_10)
   * 5B -> Grade 11 (高二, bank: GRADE_11)
   * @param {string} classID 
   * @returns {{grade: number, gradeLevel: string, gradeName: string, bankId: string}}
   */
  function getGradeByClass(classID) {
    const cls = String(classID || "").trim().toUpperCase();
    if (cls === "4C" || cls === "4D") {
      return {
        grade: 10,
        gradeLevel: "F4",
        gradeName: "高一",
        bankId: "GRADE_10",
        topicTitle: "集合、常用邏輯用語與不等式"
      };
    } else if (cls === "5B") {
      return {
        grade: 11,
        gradeLevel: "F5",
        gradeName: "高二",
        bankId: "GRADE_11",
        topicTitle: "複數與基本立體圖形"
      };
    }
    return {
      grade: 0,
      gradeLevel: "UNKNOWN",
      gradeName: "未知",
      bankId: "UNKNOWN",
      topicTitle: "未指定題庫"
    };
  }

  return {
    ROSTER_DATA: ROSTER_DATA,
    getRoster: getRoster,
    getStudentsByClass: getStudentsByClass,
    getStudent: getStudent,
    getStudentName: getStudentName,
    getGradeByClass: getGradeByClass
  };
});
