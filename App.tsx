
import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, Table, Info, TrendingDown, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PriceResult } from './types';
import { MINIMUM_SUBTOTAL, TAX_RATE, getUnitPriceByArea, PRICING_TIERS } from './constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const App: React.FC = () => {
  const [areaInput, setAreaInput] = useState<string>("20");
  
  const results = useMemo((): PriceResult => {
    const area = parseFloat(areaInput) || 0;
    const unitPrice = getUnitPriceByArea(area);
    const subtotalRaw = area * unitPrice;
    const isMinimumApplied = subtotalRaw < MINIMUM_SUBTOTAL;
    const subtotalFinal = isMinimumApplied ? MINIMUM_SUBTOTAL : subtotalRaw;
    const tax = Math.floor(subtotalFinal * TAX_RATE);
    const total = subtotalFinal + tax;

    return {
      area,
      unitPrice,
      subtotalRaw,
      subtotalFinal,
      tax,
      total,
      isMinimumApplied
    };
  }, [areaInput]);

  const chartData = useMemo(() => {
    // Sample points for the chart to show the price decay
    const points = [10, 15, 20, 25, 30, 40, 50, 63, 80];
    return points.map(a => ({
      area: a,
      price: getUnitPriceByArea(a)
    }));
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 text-white p-2 rounded-lg">
              <Calculator size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              ROLLER STONE <span className="text-slate-500 font-medium">Simulator</span>
            </h1>
          </div>
          <div className="hidden sm:block text-sm text-slate-500 font-medium">
            施工費用シミュレーター
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Intro Section */}
        <div className="text-center space-y-2 mb-4">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            施工面積から概算見積もり
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            ご希望の施工面積（㎡）を入力するだけで、最新の単価表に基づいた概算費用を瞬時に計算します。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input & Main Result */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="area" className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Table size={16} /> 施工面積を入力
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="area"
                      value={areaInput}
                      onChange={(e) => setAreaInput(e.target.value)}
                      placeholder="例: 20"
                      className="block w-full px-5 py-4 text-3xl font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-200 focus:border-slate-900 transition-all outline-none pr-16"
                    />
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                      <span className="text-2xl font-bold text-slate-400">㎡</span>
                    </div>
                  </div>
                </div>

                {/* Results Visual */}
                <div className="pt-6 border-t border-slate-100 space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      施工単価 <Info size={14} className="cursor-help" title="面積に応じて変動します" />
                    </span>
                    <span className="text-2xl font-bold text-slate-900">
                      {formatCurrency(results.unitPrice)}<span className="text-sm font-normal text-slate-400 ml-1">/㎡</span>
                    </span>
                  </div>

                  <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200">
                    <div className="flex justify-between items-center mb-2 opacity-80 text-sm">
                      <span>税込施工合計金額</span>
                      <span className="bg-slate-700 px-2 py-0.5 rounded text-xs">消費税 10% 込</span>
                    </div>
                    <div className="text-5xl font-black mb-4">
                      {formatCurrency(results.total)}
                    </div>
                    {results.isMinimumApplied && (
                      <div className="flex items-center gap-2 text-xs bg-amber-500/20 text-amber-200 p-3 rounded-xl border border-amber-500/30">
                        <Info size={14} />
                        <span>最低施工価格（{formatCurrency(MINIMUM_SUBTOTAL)} 税別）が適用されています。</span>
                      </div>
                    )}
                  </div>

                  {/* Breakdown */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <span className="block text-xs text-slate-500 mb-1">施工費用（税別）</span>
                      <span className="text-lg font-bold text-slate-800">{formatCurrency(results.subtotalFinal)}</span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <span className="block text-xs text-slate-500 mb-1">消費税額</span>
                      <span className="text-lg font-bold text-slate-800">{formatCurrency(results.tax)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Chart */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <TrendingDown size={18} className="text-slate-400" />
                  施工単価の推移
                </h3>
                <span className="text-xs text-slate-400">面積が広いほどお得になります</span>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="area" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 12, fill: '#94a3b8'}}
                      unit="㎡"
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 12, fill: '#94a3b8'}}
                      domain={['dataMin - 500', 'dataMax + 500']}
                      hide
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelFormatter={(label) => `${label}㎡`}
                      formatter={(value: number) => [`${value.toLocaleString()}円`, '単価']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#0f172a" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column: Tiers Table & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 bg-slate-50 border-b border-slate-200">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                   施工単価表（1㎡あたり・税別）
                </h3>
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white shadow-sm z-10">
                    <tr className="text-slate-400 font-medium border-b border-slate-100">
                      <th className="text-left py-3 px-6">施工面積</th>
                      <th className="text-right py-3 px-6">単価</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {PRICING_TIERS.map((tier, idx) => {
                      const prevMax = idx === 0 ? 10 : PRICING_TIERS[idx-1].maxArea + 1;
                      const rangeLabel = tier.maxArea === Infinity ? `${prevMax}㎡以上` : `${prevMax}㎡〜${tier.maxArea}㎡`;
                      const isCurrent = results.area >= prevMax && (tier.maxArea === Infinity || results.area <= tier.maxArea);
                      
                      return (
                        <tr key={idx} className={`${isCurrent ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'} transition-colors`}>
                          <td className="py-3 px-6 font-medium">
                            {idx === 0 ? '10㎡〜11㎡' : rangeLabel}
                          </td>
                          <td className="py-3 px-6 text-right font-bold">
                            {tier.price.toLocaleString()}円
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 leading-relaxed">
                <p>※10㎡以下の場合は一律、最低施工価格（115,900円 税別）が適用されます。</p>
                <p>※諸経費・下地補修費用等は別途お見積りとなります。</p>
              </div>
            </div>

            {/* Features/Why Roller Stone */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ArrowRight size={20} className="text-slate-400" />
                ローラーストーンとは？
              </h3>
              <ul className="space-y-4">
                {[
                  "既存の下地を壊さず施工可能で低コスト",
                  "驚異のスピード施工（最短即日〜）",
                  "本物の石のようなリアルな質感",
                  "カラー・デザインの自由度が極めて高い",
                  "強靭な耐久性とメンテナンス性"
                ].map((text, i) => (
                  <li key={i} className="flex gap-3 items-start text-sm opacity-90">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-white text-slate-900 font-bold py-4 rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/20">
                正式なお見積り・お問い合わせ
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} ROLLER STONE Simulator. All rights reserved.
          </p>
          <p className="text-slate-300 text-xs">
            このシミュレーターは概算費用を算出するものであり、最終的な見積金額を保証するものではありません。
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
