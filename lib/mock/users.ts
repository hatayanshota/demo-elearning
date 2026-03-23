import type { User, StudentProfile } from "@/lib/types/api";

export const mockAdminUser: User = {
  id: "user-1", email: "tanaka@school.demo", name: "田中管理者", role: "ADMIN",
  avatarUrl: null, isActive: true, createdAt: "2024-01-01T00:00:00Z",
};

export const mockTeacherUser: User = {
  id: "user-2", email: "sato@school.demo", name: "佐藤講師", role: "TEACHER",
  avatarUrl: null, isActive: true, createdAt: "2024-01-01T00:00:00Z",
};

const teacherSuzuki: User = {
  id: "user-3", email: "suzuki@school.demo", name: "鈴木講師", role: "TEACHER",
  avatarUrl: null, isActive: true, createdAt: "2024-01-15T00:00:00Z",
};

const studentNames = [
  "山田太郎","佐々木花子","高橋一郎","伊藤美咲","渡辺健太",
  "中村陽子","小林大輔","加藤裕子","吉田翔太","山口真由",
  "松本拓海","井上さくら","木村雄大","林由美子","斎藤蓮",
  "清水恵","山崎悠人","池田麻衣","橋本颯太","阿部千夏",
  "石川海斗","前田涼子","藤田大地","後藤美月","岡田和樹",
  "長谷川瑠奈","村上翼","近藤彩花","遠藤駿","青木沙織",
  "坂本光希","西村明日香","福田隼人","太田杏奈","三浦奏太",
  "藤井七海","岡本大翔","金子由奈","中島颯","原田詩織",
];

const genders: ("MALE"|"FEMALE"|"OTHER")[] = [
  "MALE","FEMALE","MALE","FEMALE","MALE","FEMALE","MALE","FEMALE","MALE","FEMALE",
  "MALE","FEMALE","MALE","FEMALE","MALE","FEMALE","MALE","FEMALE","MALE","FEMALE",
  "MALE","FEMALE","MALE","FEMALE","MALE","FEMALE","MALE","FEMALE","MALE","FEMALE",
  "MALE","FEMALE","MALE","FEMALE","MALE","FEMALE","MALE","FEMALE","MALE","OTHER",
];

const ages = [
  28,34,42,27,35,31,24,38,29,45,33,22,36,41,26,30,52,25,37,23,
  32,28,44,35,21,39,27,33,48,31,26,43,29,34,55,24,38,22,46,30,
];

const occupations = [
  "会社員","会社員","自営業","会社員","フリーランス","会社員","学生","会社員","フリーランス","自営業",
  "会社員","学生","会社員","自営業","会社員","フリーランス","会社員","会社員","自営業","学生",
  "会社員","フリーランス","会社員","会社員","学生","会社員","自営業","会社員","会社員","フリーランス",
  "会社員","会社員","自営業","会社員","その他","会社員","フリーランス","会社員","自営業","その他",
];

const prefectures = [
  "東京都","東京都","大阪府","神奈川県","東京都","東京都","大阪府","愛知県","東京都","福岡県",
  "東京都","神奈川県","大阪府","東京都","埼玉県","千葉県","北海道","東京都","大阪府","東京都",
  "神奈川県","京都府","東京都","広島県","東京都","大阪府","兵庫県","東京都","静岡県","宮城県",
  "東京都","神奈川県","大阪府","奈良県","岡山県","東京都","長野県","茨城県","東京都","大阪府",
];

const enrollDates = [
  "2025-03-15","2025-04-01","2025-02-10","2025-05-20","2025-06-01",
  "2025-04-15","2025-07-01","2025-03-01","2025-05-10","2025-08-01",
  "2025-06-15","2025-04-20","2025-03-10","2025-07-15","2025-05-01",
  "2025-08-15","2025-02-01","2025-06-20","2025-09-01","2025-04-10",
  "2025-07-20","2025-05-15","2025-08-10","2025-03-20","2025-09-15",
  "2025-06-10","2025-10-01","2025-07-05","2025-04-25","2025-11-01",
  "2025-08-20","2025-05-25","2025-10-15","2025-09-10","2025-11-15",
  "2025-12-01","2025-10-20","2025-11-10","2025-12-15","2026-01-05",
];

// churnRiskScores: 完了者(0-4) LOW, 順調(5-19) LOW-MED, 停滞(20-29) MED-HIGH, 離脱(30-39) HIGH
const churnScores = [
  12,8,15,22,10, 18,25,35,20,42, 28,14,38,45,16, 30,55,22,48,12,
  62,28,70,35,8,  40,65,18,75,52, 85,32,68,45,90, 72,58,82,78,95,
];

function churnLevel(score: number): "LOW"|"MEDIUM"|"HIGH" {
  if (score <= 30) return "LOW";
  if (score <= 60) return "MEDIUM";
  return "HIGH";
}

function lastLogin(index: number): string | null {
  const score = churnScores[index];
  if (score > 70) {
    const daysAgo = 30 + Math.floor(score / 2);
    const d = new Date("2026-03-05");
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
  }
  if (score > 40) {
    const daysAgo = 7 + Math.floor(score / 5);
    const d = new Date("2026-03-05");
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
  }
  const daysAgo = Math.floor(score / 10);
  const d = new Date("2026-03-05");
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

const studentUsers: User[] = studentNames.map((name, i) => ({
  id: `user-${i + 4}`,
  email: `student${i + 1}@school.demo`,
  name,
  role: "STUDENT" as const,
  avatarUrl: null,
  isActive: true,
  createdAt: enrollDates[i] + "T00:00:00Z",
}));

export const mockStudentUser: User = studentUsers[0]; // 山田太郎

export const mockUsers: User[] = [mockAdminUser, mockTeacherUser, teacherSuzuki, ...studentUsers];

const lineNames: (string | null)[] = [
  "太郎@マーケ",null,"ichiro_t","misaki_ito",null,
  "yoko.nakamura","だいすけ",null,"shota_y","mayu_yamaguchi",
  null,"sakura_i","yudai_k",null,"ren_saito",
  "megumi_s",null,"mai_ikeda","sota_h",null,
  "kaito_ishi","ryoko_m",null,"mizuki_goto","kazu_okada",
  null,"tsubasa_m","ayaka_k",null,"saori_aoki",
  "koki_s",null,"hayato_f","anna_ota",null,
  "nanami_f","hiroto_o",null,"hayate_n","shiori_h",
];

const chatworkNames: (string | null)[] = [
  "yamada_taro","sasaki_h",null,"ito_misaki","watanabe_k",
  null,"kobayashi_d","kato_y","yoshida_s",null,
  "matsumoto_t","inoue_s",null,"hayashi_y","saito_r",
  "shimizu_m",null,"ikeda_m","hashimoto_s","abe_c",
  null,"maeda_r","fujita_d",null,"okada_k",
  "hasegawa_r",null,"kondo_a","endo_s","aoki_s",
  null,"nishimura_a","fukuda_h",null,"miura_s",
  "fujii_n",null,"kaneko_y","nakajima_h",null,
];

const meetNames: (string | null)[] = [
  "t.yamada@meet",null,null,"m.ito@meet","k.watanabe@meet",
  null,"d.kobayashi@meet",null,"s.yoshida@meet",null,
  "t.matsumoto@meet","s.inoue@meet",null,null,"r.saito@meet",
  null,"y.yamazaki@meet",null,null,"c.abe@meet",
  "k.ishikawa@meet",null,"d.fujita@meet",null,null,
  "r.hasegawa@meet",null,"a.kondo@meet",null,null,
  "k.sakamoto@meet","a.nishimura@meet",null,"a.ota@meet",null,
  null,"h.okamoto@meet",null,null,"s.harada@meet",
];

export const mockStudentProfiles: StudentProfile[] = studentNames.map((_, i) => ({
  id: `profile-${i + 1}`,
  userId: `user-${i + 4}`,
  age: ages[i],
  gender: genders[i],
  occupation: occupations[i],
  prefecture: prefectures[i],
  enrolledAt: enrollDates[i] + "T00:00:00Z",
  churnRiskScore: churnScores[i],
  churnRiskLevel: churnLevel(churnScores[i]),
  lastLoginAt: lastLogin(i),
  lineName: lineNames[i],
  chatworkName: chatworkNames[i],
  meetName: meetNames[i],
  isSalonMember: i % 3 === 0,
}));
