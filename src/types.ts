export interface SurveyData {
  id: number;
  major: string;
  attackVector: string; // QR Code, واتساب, سناب شات, أرسله صديق
  checkedLink: string; // نعم دائماً, لا لم يخطر ببالي, أحياناً
  expectedAwareness: string; // نعم التصميم مريب, لا بدا رسمياً جداً, شككت قليلاً
  samePassword: string; // نعم في أغلب المواقع, لا, في بعض المواقع فقط
  willBeMoreCareful: string; // نعم بكل تأكيد, سأحاول الانتباه أكثر, سأفعل التحقق الثنائي
}

export const MAJORS = [
  "هندسة البرمجيات",
  "نظم المعلومات",
  "علوم الحاسب",
  "الأمن السيبراني",
  "إدارة الأعمال",
  "الموارد البشرية",
  "التسويق",
  "تخصصات أخرى"
];

export const ATTACK_VECTORS = ["QR Code", "واتساب", "سناب شات", "أرسله صديق"];
export const VIGILANCE_LEVELS = ["نعم دائماً", "لا لم يخطر ببالي", "أحياناً"];
export const TRUST_FACTORS = ["نعم التصميم مريب", "لا بدا رسمياً جداً", "شككت قليلاً"];
export const PASSWORD_RISKS = ["نعم في أغلب المواقع", "لا", "في بعض المواقع فقط"];
export const AWARENESS_IMPACTS = ["نعم بكل تأكيد", "سأحاول الانتباه أكثر", "سأفعل التحقق الثنائي"];
