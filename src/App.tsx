/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LabelList
} from 'recharts';
import { 
  Users, ShieldAlert, Lock, Filter, 
  ChevronDown, LayoutDashboard, TrendingUp, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_DATA } from './constants';
import { MAJORS, ATTACK_VECTORS } from './types';

const COLORS = {
  blue: '#1e3a8a',
  lightBlue: '#3b82f6',
  purple: '#7c3aed',
  gray: '#64748b',
  lightGray: '#f1f5f9',
  white: '#ffffff',
  red: '#ef4444',
  green: '#10b981'
};

const CHART_PALETTE = [COLORS.blue, COLORS.purple, COLORS.lightBlue, COLORS.gray, '#94a3b8'];

export default function App() {
  const [selectedMajor, setSelectedMajor] = useState<string>('الكل');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredData = useMemo(() => {
    if (selectedMajor === 'الكل') return MOCK_DATA;
    return MOCK_DATA.filter(d => d.major === selectedMajor);
  }, [selectedMajor]);

  // Stats Calculations
  const stats = useMemo(() => {
    const total = filteredData.length;
    const lowAwarenessCount = filteredData.filter(d => d.checkedLink === 'لا لم يخطر ببالي').length;
    const samePasswordCount = filteredData.filter(d => d.samePassword === 'نعم في أغلب المواقع').length;
    const positiveImpactCount = filteredData.filter(d => d.willBeMoreCareful === 'نعم بكل تأكيد').length;

    return {
      total,
      lowAwarenessRate: total > 0 ? Math.round((lowAwarenessCount / total) * 100) : 0,
      samePasswordRate: total > 0 ? Math.round((samePasswordCount / total) * 100) : 0,
      impactRate: total > 0 ? Math.round((positiveImpactCount / total) * 100) : 0,
    };
  }, [filteredData]);

  // Chart Data Preparation
  const attackVectorData = useMemo(() => {
    const counts: Record<string, number> = {};
    ATTACK_VECTORS.forEach(v => counts[v] = 0);
    
    filteredData.forEach(d => {
      counts[d.attackVector] = (counts[d.attackVector] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const vigilanceData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(d => {
      counts[d.checkedLink] = (counts[d.checkedLink] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const trustFactorData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(d => {
      counts[d.expectedAwareness] = (counts[d.expectedAwareness] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const passwordRiskStackedData = useMemo(() => {
    const counts: Record<string, number> = { 'نعم في أغلب المواقع': 0, 'لا': 0, 'في بعض المواقع فقط': 0 };
    filteredData.forEach(d => {
      counts[d.samePassword] = (counts[d.samePassword] || 0) + 1;
    });
    return [{
      name: 'التوزيع',
      ...counts
    }];
  }, [filteredData]);

  const awarenessImpactData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(d => {
      counts[d.willBeMoreCareful] = (counts[d.willBeMoreCareful] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-pure-white text-brand-blue p-4 md:p-8 font-sans" dir="rtl">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border-gray/30 pb-8">
        <div className="flex items-center gap-6">
          <div className="text-right">
            <h1 className="text-3xl font-arabic font-bold tracking-tight text-brand-blue">
              تقرير التجربة الاجتماعية <span className="text-brand-purple">Next2026</span>
            </h1>
            <p className="opacity-60 text-sm font-arabic mt-1">لوحة بيانات تحليل الوعي السيبراني والنتائج الإحصائية</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Filter Slicer */}
          <div className="relative flex-1 md:flex-none">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full md:w-64 flex items-center justify-between gap-3 px-6 py-3 bg-[#f8fafc] border border-gray-200 rounded-xl hover:opacity-80 transition-all group text-brand-blue"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand-purple" />
                <span className="font-arabic font-medium">{selectedMajor === 'الكل' ? 'تصفية حسب التخصص' : selectedMajor}</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-full md:w-64 bg-white border border-gray-200 rounded-xl overflow-hidden z-50 shadow-xl"
                >
                  <div className="p-2">
                    <button 
                      onClick={() => { setSelectedMajor('الكل'); setIsFilterOpen(false); }}
                      className={`w-full text-right px-4 py-2 rounded-lg transition-colors font-arabic ${selectedMajor === 'الكل' ? 'bg-brand-purple/10 text-brand-purple' : 'hover:bg-gray-50'}`}
                    >
                      الكل
                    </button>
                    {MAJORS.map(major => (
                      <button 
                        key={major}
                        onClick={() => { setSelectedMajor(major); setIsFilterOpen(false); }}
                        className={`w-full text-right px-4 py-2 rounded-lg transition-colors font-arabic ${selectedMajor === major ? 'bg-brand-purple/10 text-brand-purple' : 'hover:bg-gray-50'}`}
                      >
                        {major}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-12">
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={<Users className="w-5 h-5 text-brand-blue" />}
            label="إجمالي المشاركين"
            value={stats.total}
            subtext="مشارك في التجربة"
          />
          <StatCard 
            icon={<ShieldAlert className="w-5 h-5 text-red" />}
            label="معدل الوعي المنخفض"
            value={`${stats.lowAwarenessRate}%`}
            subtext="لم يتحققوا من الرابط"
          />
          <StatCard 
            icon={<Lock className="w-5 h-5 text-brand-purple" />}
            label="مؤشر تكرار البيانات"
            value={`${stats.samePasswordRate}%`}
            subtext="يستخدمون نفس الباسورد"
          />
          <StatCard 
            icon={<TrendingUp className="w-5 h-5 text-green" />}
            label="معدل الاستجابة للتوعية"
            value={`${stats.impactRate}%`}
            subtext="أكدوا زيادة حذرهم"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* 1. Reach Analysis (Donut) */}
          <ChartContainer 
            title="تحليل الوصول" 
            subtitle="كيف وصلك الرابط؟"
            description="يوضح هذا الرسم فعالية قنوات التواصل الاجتماعي في نشر الروابط."
          >
            <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={attackVectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {attackVectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_PALETTE[index % CHART_PALETTE.length]} />
                    ))}
                    <LabelList 
                      dataKey="value" 
                      position="inside" 
                      fill="#fff" 
                      fontSize={10} 
                      fontWeight="bold"
                      formatter={(value: number) => value > 0 ? `${Math.round(value * 100 / stats.total)}%` : ''}
                    />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '12px', 
                      textAlign: 'right', 
                      fontSize: '12px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => <span className="font-arabic text-[11px] opacity-70 font-bold text-brand-blue">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>

          {/* 2. Credibility Check (Bar) */}
          <ChartContainer 
            title="التحقق من المصداقية" 
            subtitle="هل تحققت من الرابط قبل التسجيل؟"
            description="يعكس هذا الرسم السلوك الأمني الحقيقي للمستخدمين تجاه الروابط المشبوهة."
          >
            <div className="flex-1 min-h-[300px] flex flex-col">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={vigilanceData} layout="vertical" margin={{ right: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} opacity={0.3} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" hide />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '12px', 
                      textAlign: 'right', 
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 0, 0, 8]} barSize={25}>
                    {vigilanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_PALETTE[(index + 2) % CHART_PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-3">
                {vigilanceData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_PALETTE[(i + 2) % CHART_PALETTE.length] }} />
                    <span className="font-arabic text-[11px] opacity-70 font-bold text-brand-blue">{d.name}: {Math.round(d.value * 100 / stats.total)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartContainer>

          {/* 3. Psychology of Trust (Pie Chart) */}
          <ChartContainer 
            title="سيكولوجية الثقة" 
            subtitle="هل كنت تتوقع أنه موقع توعية؟"
            description="يوضح أثر جودة التصميم في خفض شكوك المستخدمين."
          >
            <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center pt-8">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart margin={{ top: 20 }}>
                  <Pie
                    data={trustFactorData.map(d => ({
                      ...d,
                      displayName: d.name === "لا بدا رسمياً جداً" ? "رسمي جداً" : 
                                  d.name === "شككت قليلاً" ? "شكوك بسيطة" : "تصميم مريب"
                    }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    dataKey="value"
                    nameKey="displayName"
                    labelLine={false}
                  >
                    {trustFactorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_PALETTE[(index + 1) % CHART_PALETTE.length]} />
                    ))}
                    <LabelList 
                      dataKey="value" 
                      position="inside" 
                      fill="#fff" 
                      fontSize={11} 
                      fontWeight="bold"
                      formatter={(value: number) => value > 0 ? `${Math.round(value * 100 / stats.total)}%` : ''}
                    />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '12px', 
                      textAlign: 'right', 
                      fontSize: '12px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => <span className="font-arabic text-[11px] opacity-70 font-bold text-brand-blue">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>

          {/* 4. Password Risks (Stacked Bar Chart) */}
          <ChartContainer 
            title="مخاطر كلمات المرور" 
            subtitle="هل تستخدم نفس الباسورد في مواقع أخرى؟"
            description="يوضح حجم الكارثة الأمنية المحتملة لتسريب كلمة مرور واحدة."
          >
            <div className="flex-1 min-h-[300px] flex flex-col">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={passwordRiskStackedData} layout="vertical" stackOffset="expand" margin={{ top: 20, left: 20, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '12px', 
                      textAlign: 'right', 
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => `${Math.round(value * 100 / stats.total)}%`}
                  />
                  <Bar dataKey="نعم في أغلب المواقع" stackId="a" fill={COLORS.red} radius={[4, 0, 0, 4]} />
                  <Bar dataKey="في بعض المواقع فقط" stackId="a" fill={COLORS.purple} />
                  <Bar dataKey="لا" stackId="a" fill={COLORS.green} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 px-4">
                {["نعم في أغلب المواقع", "في بعض المواقع فقط", "لا"].map((key, i) => {
                  const counts = passwordRiskStackedData[0] as any;
                  const val = counts[key] || 0;
                  const percentage = Math.round(val * 100 / stats.total);
                  const colors = [COLORS.red, COLORS.purple, COLORS.green];
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i] }} />
                      <span className="font-arabic text-[11px] opacity-70 font-bold whitespace-nowrap text-brand-blue">
                        {key}: {percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </ChartContainer>

          {/* 5. Awareness Impact (Vertical Bar) */}
          <ChartContainer 
            title="أثر التجربة" 
            subtitle="هل ستكون أكثر حذراً بعد هذه التجربة؟"
            description="يحقق الهدف الأسمى للواجب وهو إحداث تغيير سلوكي."
          >
            <div className="flex-1 min-h-[300px] flex flex-col">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={awarenessImpactData} layout="vertical" margin={{ right: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} opacity={0.3} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" hide />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      textAlign: 'right', 
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 0, 0, 8]} barSize={30}>
                    {awarenessImpactData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_PALETTE[index % CHART_PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3">
                {awarenessImpactData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_PALETTE[i % CHART_PALETTE.length] }} />
                    <span className="font-arabic text-[11px] opacity-70 font-bold text-brand-blue">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartContainer>

          {/* Conclusion Section */}
          <div className="bg-white rounded-3xl p-10 flex flex-col justify-center space-y-8 border border-gray-100 card-shadow">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
              <div className="p-2 bg-brand-blue/5 rounded-xl">
                <LayoutDashboard className="text-brand-purple w-5 h-5" />
              </div>
              <h3 className="text-2xl font-arabic font-bold text-brand-blue">الخلاصة</h3>
            </div>
            <div className="space-y-6 opacity-70 leading-[1.15] font-arabic text-right">
              <div className="flex items-start gap-6 pr-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                <p className="text-sm">أثبتت التجربة أن <span className="text-brand-purple font-bold">الثقة العمياء</span> هي الثغرة الأكبر، حيث لم يتحقق {stats.lowAwarenessRate}% من المشاركين من الرابط.</p>
              </div>
              <div className="flex items-start gap-6 pr-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                <p className="text-sm">هناك حاجة ملحة لتعزيز الوعي حول <span className="text-brand-purple font-bold">إدارة كلمات المرور</span>، نظراً لارتفاع نسبة التكرار بين الحسابات.</p>
              </div>
              <div className="flex items-start gap-6 pr-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                <p className="text-sm">النتائج تشير إلى أن <span className="text-brand-purple font-bold">التوعية العملية</span> أكثر تأثيراً من المحاضرات النظرية التقليدية.</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-24 pt-8 border-t border-border-gray/30 text-center flex flex-col items-center gap-4">
        <div className="px-4 py-2 rounded-xl bg-brand-purple/5 border border-brand-purple/10 flex items-center justify-center shadow-sm">
          <span className="text-brand-purple font-bold text-sm tracking-wider">Made by Rana</span>
        </div>
        <p className="opacity-40 text-sm font-arabic text-brand-blue">
          &copy; 2026 مشروع NEXT | مبادرة تعزيز الوعي بالأمن السيبراني | جميع الحقوق محفوظة
        </p>
      </footer>
    </div>
  );
}

function StatCard({ icon, label, value, subtext }: { icon: React.ReactNode, label: string, value: string | number, subtext: string }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center card-shadow transition-all"
    >
      <div className="p-2 bg-gray-50 rounded-xl mb-4">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="opacity-60 text-xs font-arabic font-medium uppercase tracking-wider text-brand-blue">{label}</p>
        <h4 className="text-4xl font-arabic font-bold text-brand-blue">{value}</h4>
        <p className="opacity-40 text-[10px] font-arabic text-brand-blue">{subtext}</p>
      </div>
    </motion.div>
  );
}

function ChartContainer({ title, subtitle, description, children }: { title: string, subtitle: string, description: string, children: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border border-gray-100 rounded-3xl p-8 flex flex-col card-shadow"
    >
      <div className="mb-10 text-right">
        <h3 className="text-xl font-arabic font-bold text-brand-blue mb-1">{title}</h3>
        <p className="text-xs opacity-40 font-arabic text-brand-blue">{subtitle}</p>
      </div>
      <div className="flex-1 min-h-[300px]">
        {children}
      </div>
      <div className="mt-8 pt-6 border-t border-gray-100 text-right">
        <p className="text-[11px] opacity-50 font-arabic leading-relaxed text-brand-blue">{description}</p>
      </div>
    </motion.div>
  );
}