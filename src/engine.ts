export type Grade = "O" | "A+" | "A" | "B+" | "B" | "C" | "P" | "F" | "I" | "P/F";

export type Course = {
  code: string;
  title: string;
  credits: number;
  semester: number;
  category: "Core" | "Science" | "Engineering" | "Humanities" | "Project" | "Elective";
  evaluation: string;
  passFail?: boolean;
};

export type Attempt = { courseCode: string; grade: Grade; confirmed: boolean };

export const gradePoints: Record<Exclude<Grade, "I" | "P/F">, number> = {
  O: 10, "A+": 9, A: 8, "B+": 7, B: 6, C: 5, P: 4, F: 0
};

export const cse2023: Course[] = [
  ["23ENG101","Technical Communication",3,1,"Humanities","70:30"], ["23MAT107","Calculus",4,1,"Science","70:30"], ["23CSE101","Computational Problem Solving",4,1,"Core","70:30"], ["23EEE104","Introduction to Electrical and Electronics Engineering",3,1,"Engineering","50:50"], ["23EEE184","Basic EEE Practice",1,1,"Engineering","80:20"], ["23CSE102","Computer Hardware Essentials",2,1,"Engineering","70:30"], ["22ADM101","Foundations of Indian Heritage",2,1,"Humanities","50:50"], ["22AVP103","Mastery Over Mind",2,1,"Humanities","80:20"],
  ["23MAT116","Discrete Mathematics",4,2,"Science","70:30"], ["23MAT117","Linear Algebra",4,2,"Science","70:30"], ["23CSE111","Object Oriented Programming",4,2,"Core","70:30"], ["23PHY115","Modern Physics",3,2,"Science","50:50"], ["23CSE113","User Interface Design",3,2,"Core","70:30"], ["23MEE115","Manufacturing Practice",1,2,"Engineering","80:20"], ["22ADM111","Glimpses of Glorious India",2,2,"Humanities","50:50"],
  ["23MAT206","Optimization Techniques",4,3,"Science","70:30"], ["23CSE205","Digital Electronics",3,3,"Engineering","60:40"], ["23CSE201","Procedural Programming using C",4,3,"Core","70:30"], ["23CSE202","Database Management Systems",4,3,"Core","70:30"], ["23CSE203","Data Structures and Algorithms",5,3,"Core","70:30"], ["23CSE285","Digital Electronics Laboratory",1,3,"Engineering","80:20"], ["23LSE201","Life Skills for Engineers I",0,3,"Humanities","P/F",true], ["AVP-I","Amrita Value Programme I",1,3,"Humanities","—"],
  ["23MAT216","Probability and Random Processes",4,4,"Science","70:30"], ["23CSE211","Design and Analysis of Algorithms",4,4,"Core","70:30"], ["23CSE212","Principles of Functional Languages",3,4,"Core","70:30"], ["23CSE213","Computer Organization and Architecture",4,4,"Engineering","50:50"], ["23CSE214","Operating Systems",4,4,"Core","70:30"], ["AVP-II","Amrita Value Programme II",1,4,"Humanities","—"], ["FREE-I","Free Elective I",2,4,"Humanities","—"], ["23LSE211","Life Skills for Engineers II",2,4,"Humanities","50:50"],
  ["23CSE301","Machine Learning",4,5,"Core","70:30"], ["PE-I","Professional Elective I",3,5,"Elective","70:30"], ["23CSE302","Computer Networks",5,5,"Core","70:30"], ["23CSE303","Theory of Computation",4,5,"Core","50:50"], ["23CSE304","Embedded Systems",4,5,"Engineering","70:30"], ["PE-II","Professional Elective II",3,5,"Elective","70:30"], ["23LSE301","Life Skills for Engineers III",2,5,"Humanities","50:50"], ["23ENV300","Environmental Science",0,5,"Humanities","P/F",true],
  ["23CSE311","Software Engineering",4,6,"Engineering","70:30"], ["23CSE312","Distributed Systems",4,6,"Engineering","70:30"], ["23CSE313","Foundations of Cyber Security",3,6,"Core","70:30"], ["PE-III","Professional Elective III",3,6,"Elective","70:30"], ["23CSE314","Compiler Design",4,6,"Core","70:30"], ["23CSE399","Project Phase I",3,6,"Project","70:30"], ["23LSE311","Life Skills for Engineers IV",2,6,"Humanities","50:50"],
  ["PE-IV","Professional Elective IV",3,7,"Elective","70:30"], ["PE-V","Professional Elective V",3,7,"Elective","70:30"], ["PE-VI","Professional Elective VI",3,7,"Elective","70:30"], ["FREE-II","Free Elective II",2,7,"Engineering","—"], ["23CSE401","Fundamentals of Artificial Intelligence",3,7,"Core","70:30"], ["23CSE498","Project Phase II",6,7,"Project","70:30"], ["23LAW300","Indian Constitution",0,7,"Humanities","P/F",true], ["23CSE499","Project Phase III",6,8,"Project","70:30"]
].map(([code,title,credits,semester,category,evaluation,passFail]) => ({ code: code as string, title: title as string, credits: credits as number, semester: semester as number, category: category as Course["category"], evaluation: evaluation as string, passFail: passFail as boolean | undefined }));

export const sampleAttempts: Attempt[] = [
  { courseCode: "23ENG101", grade: "A+", confirmed: true }, { courseCode: "23MAT107", grade: "A", confirmed: true }, { courseCode: "23CSE101", grade: "O", confirmed: true }, { courseCode: "23EEE104", grade: "B+", confirmed: true }, { courseCode: "23EEE184", grade: "A", confirmed: true }, { courseCode: "23CSE102", grade: "A+", confirmed: true }, { courseCode: "22ADM101", grade: "A", confirmed: true }, { courseCode: "22AVP103", grade: "A+", confirmed: true },
  { courseCode: "23MAT116", grade: "A", confirmed: true }, { courseCode: "23MAT117", grade: "A+", confirmed: true }, { courseCode: "23CSE111", grade: "O", confirmed: true }, { courseCode: "23PHY115", grade: "A", confirmed: true }, { courseCode: "23CSE113", grade: "A+", confirmed: true }, { courseCode: "23MEE115", grade: "O", confirmed: true }, { courseCode: "22ADM111", grade: "A", confirmed: true }
];

export function calculateGpa(courses: Course[], attempts: Attempt[]) {
  const byCode = new Map(courses.map(course => [course.code, course]));
  const confirmed = attempts.filter(attempt => attempt.confirmed && byCode.has(attempt.courseCode));
  const eligible = confirmed.filter(attempt => { const course = byCode.get(attempt.courseCode)!; return !course.passFail && course.credits > 0 && attempt.grade !== "I" && attempt.grade !== "P/F"; });
  const earnedCredits = eligible.reduce((sum, attempt) => sum + byCode.get(attempt.courseCode)!.credits, 0);
  const qualityPoints = eligible.reduce((sum, attempt) => sum + byCode.get(attempt.courseCode)!.credits * gradePoints[attempt.grade as Exclude<Grade,"I"|"P/F">], 0);
  const failed = eligible.filter(attempt => attempt.grade === "F").length;
  return { earnedCredits, qualityPoints, cgpa: earnedCredits ? qualityPoints / earnedCredits : 0, failed, eligible };
}

export function goalScenario(courses: Course[], attempts: Attempt[], target: number) {
  const result = calculateGpa(courses, attempts);
  const confirmedCodes = new Set(attempts.filter(a => a.confirmed).map(a => a.courseCode));
  const remainingCredits = courses.filter(c => !c.passFail && c.credits > 0 && !confirmedCodes.has(c.code)).reduce((sum,c) => sum + c.credits, 0);
  const neededPoints = target * (result.earnedCredits + remainingCredits) - result.qualityPoints;
  const requiredAverage = remainingCredits ? neededPoints / remainingCredits : 0;
  return { ...result, remainingCredits, target, requiredAverage, feasible: requiredAverage <= 10, achieved: result.cgpa >= target };
}

