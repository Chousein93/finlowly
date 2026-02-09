'use client';

import { useState } from 'react';
import {
    Settings,
    Globe,
    Coins,
    Moon,
    Sun,
    Monitor,
    Bell,
    Lock,
    Database,
    Info,
    ChevronRight,
    Download,
    Trash2,
    Save,
    ShieldCheck,
    History,
    KeyRound,
    FileText,
    MessageSquare,
    HelpCircle,
    ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export function SettingsView() {
    const [reminders, setReminders] = useState(true);
    const [goalUpdates, setGoalUpdates] = useState(false);
    const [budgetAlerts, setBudgetAlerts] = useState(true);
    const [weeklySummary, setWeeklySummary] = useState(false);
    const [twoFactor, setTwoFactor] = useState(false);

    return (
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 animate-in fade-in duration-500 max-w-[1000px] mx-auto pb-24">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Ayarlar</h1>
                    <p className="text-sm text-slate-500 mt-1">Uygulama tercihleriniz ve hesap yönetimi.</p>
                </div>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-slate-900/10 shrink-0">
                    <Save className="h-5 w-5 mr-2" />
                    Kaydet
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* 1. GENEL AYARLAR */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Globe className="h-5 w-5 text-slate-400" />
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">Genel</h2>
                    </div>

                    <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
                        <CardContent className="divide-y divide-slate-100 p-0">
                            {/* Dil Seçimi */}
                            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <Label className="text-sm font-bold text-slate-800">Dil</Label>
                                    <p className="text-xs text-slate-500">Uygulama arayüz dili.</p>
                                </div>
                                <Select defaultValue="tr">
                                    <SelectTrigger className="w-full sm:w-[180px] h-10 border-slate-200">
                                        <SelectValue placeholder="Dil Seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tr">Türkçe</SelectItem>
                                        <SelectItem value="en">English</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Para Birimi */}
                            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <Label className="text-sm font-bold text-slate-800">Para Birimi</Label>
                                    <p className="text-xs text-slate-500">Varsayılan finansal para birimi.</p>
                                </div>
                                <Select defaultValue="try">
                                    <SelectTrigger className="w-full sm:w-[180px] h-10 border-slate-200">
                                        <SelectValue placeholder="Para Birimi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="try">TRY (₺)</SelectItem>
                                        <SelectItem value="usd">USD ($)</SelectItem>
                                        <SelectItem value="eur">EUR (€)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Tema Seçimi */}
                            <div className="p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <Label className="text-sm font-bold text-slate-800">Görünüm</Label>
                                    <p className="text-xs text-slate-500">Uygulama renk teması tercihi.</p>
                                </div>
                                <RadioGroup defaultValue="system" className="grid grid-cols-3 gap-3 w-full sm:w-[320px]">
                                    <div>
                                        <RadioGroupItem value="light" id="light" className="peer sr-only" />
                                        <Label
                                            htmlFor="light"
                                            className="flex flex-col items-center justify-between rounded-lg border-2 border-slate-100 bg-white p-3 hover:bg-slate-50 peer-data-[state=checked]:border-slate-900 [&:has([data-state=checked])]:border-slate-900 cursor-pointer transition-all"
                                        >
                                            <Sun className="mb-2 h-4 w-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Açık</span>
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                                        <Label
                                            htmlFor="dark"
                                            className="flex flex-col items-center justify-between rounded-lg border-2 border-slate-100 bg-white p-3 hover:bg-slate-50 peer-data-[state=checked]:border-slate-900 [&:has([data-state=checked])]:border-slate-900 cursor-pointer transition-all"
                                        >
                                            <Moon className="mb-2 h-4 w-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Koyu</span>
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="system" id="system" className="peer sr-only" />
                                        <Label
                                            htmlFor="system"
                                            className="flex flex-col items-center justify-between rounded-lg border-2 border-slate-100 bg-white p-3 hover:bg-slate-50 peer-data-[state=checked]:border-slate-900 [&:has([data-state=checked])]:border-slate-900 cursor-pointer transition-all"
                                        >
                                            <Monitor className="mb-2 h-4 w-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Sistem</span>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* 2. BİLDİRİM AYARLARI */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Bell className="h-5 w-5 text-slate-400" />
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">Bildirimler</h2>
                    </div>

                    <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
                        <CardContent className="divide-y divide-slate-100 p-0">
                            {/* Reminder Toggles */}
                            {[
                                { label: 'Ödeme Hatırlatıcıları', desc: 'Yaklaşan taksit ve faturalar için bildirim al.', state: reminders, setter: setReminders },
                                { label: 'Hedef Güncellemeleri', desc: 'Hedeflerinize yaklaştığınızda veya ulaştığınızda bildirim al.', state: goalUpdates, setter: setGoalUpdates },
                                { label: 'Bütçe Uyarıları', desc: 'Belirlediğiniz bütçe limitlerine yaklaştığınızda uyarıl.', state: budgetAlerts, setter: setBudgetAlerts },
                                { label: 'Haftalık Özet', desc: 'Haftalık finansal durum raporu al.', state: weeklySummary, setter: setWeeklySummary },
                            ].map((item, idx) => (
                                <div key={idx} className="p-6 flex items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-bold text-slate-800">{item.label}</Label>
                                        <p className="text-xs text-slate-500">{item.desc}</p>
                                    </div>
                                    <Switch checked={item.state} onCheckedChange={item.setter} />
                                </div>
                            ))}

                            {/* Bildirim Zamanı */}
                            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <Label className="text-sm font-bold text-slate-800">Bildirim Zamanı</Label>
                                    <p className="text-xs text-slate-500">Hatırlatıcıların ne kadar süre önce gönderileceği.</p>
                                </div>
                                <Select defaultValue="1day">
                                    <SelectTrigger className="w-full sm:w-[180px] h-10 border-slate-200">
                                        <SelectValue placeholder="Süre Seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1day">1 gün önce</SelectItem>
                                        <SelectItem value="3days">3 gün önce</SelectItem>
                                        <SelectItem value="1week">1 hafta önce</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* 3. GÜVENLİK */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Lock className="h-5 w-5 text-slate-400" />
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">Güvenlik</h2>
                    </div>

                    <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
                        <CardContent className="divide-y divide-slate-100 p-0">
                            <div className="p-6 flex items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <Label className="text-sm font-bold text-slate-800">Şifre İşlemleri</Label>
                                    <p className="text-xs text-slate-500">Mevcut şifrenizi güncelleyin.</p>
                                </div>
                                <Button variant="outline" size="sm" className="border-slate-200 text-xs font-bold h-9 px-4 rounded-lg">
                                    <KeyRound className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                    Şifre Değiştir
                                </Button>
                            </div>

                            <div className="p-6 flex items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <Label className="text-sm font-bold text-slate-800">İki Faktörlü Doğrulama</Label>
                                    <p className="text-xs text-slate-500">Hesabınıza ekstra bir güvenlik katmanı ekleyin.</p>
                                </div>
                                <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                            </div>

                            <div className="p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors">
                                <div className="space-y-1">
                                    <Label className="text-sm font-bold text-slate-800">Oturum Geçmişi</Label>
                                    <p className="text-xs text-slate-500">Son oturum açma aktivitelerinizi inceleyin.</p>
                                </div>
                                <History className="h-4 w-4 text-slate-300" />
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* 4. VERİ YÖNETİMİ */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Database className="h-5 w-5 text-slate-400" />
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">Veri Yönetimi</h2>
                    </div>

                    <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
                        <CardContent className="divide-y divide-slate-100 p-0">
                            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <Label className="text-sm font-bold text-slate-800">Verileri Dışa Aktar</Label>
                                    <p className="text-xs text-slate-500">Tüm verilerinizi JSON veya CSV formatında indirin.</p>
                                </div>
                                <Button variant="outline" size="sm" className="border-slate-200 text-xs font-bold h-9 px-4 rounded-lg">
                                    <Download className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                    Dışa Aktar
                                </Button>
                            </div>

                            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <Label className="text-sm font-bold text-slate-800">Yedekleme Oluştur</Label>
                                    <p className="text-xs text-slate-500">Verilerinizin güncel bir yedeğini oluşturun.</p>
                                </div>
                                <Button variant="outline" size="sm" className="border-slate-200 text-xs font-bold h-9 px-4 rounded-lg">
                                    <ShieldCheck className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                    Yedekle
                                </Button>
                            </div>

                            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-rose-50/10">
                                <div className="space-y-1">
                                    <Label className="text-sm font-bold text-rose-600">Tüm Verileri Sil</Label>
                                    <p className="text-xs text-rose-500/70">Hesabınızdaki tüm verileri kalıcı olarak siler ve bu işlem geri alınamaz.</p>
                                </div>
                                <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-bold h-9 px-4 rounded-lg">
                                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                                    Tüm Verileri Sil
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* 5. UYGULAMA BİLGİLERİ */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Info className="h-5 w-5 text-slate-400" />
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">Uygulama Bilgileri</h2>
                    </div>

                    <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
                        <CardContent className="divide-y divide-slate-100 p-0">
                            <div className="p-6 flex items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <Label className="text-sm font-bold text-slate-800">Versiyon</Label>
                                    <p className="text-xs text-slate-500">Uygulamanın güncel sürümü.</p>
                                </div>
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full uppercase tracking-widest">v1.0.0</span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100 bg-slate-50/30">
                                {[
                                    { label: 'Gizlilik Politikası', icon: FileText },
                                    { label: 'Kullanım Koşulları', icon: HelpCircle },
                                    { label: 'Hakkında', icon: Info },
                                    { label: 'İletişim', icon: MessageSquare },
                                ].map((item, idx) => (
                                    <button key={idx} className="p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors group">
                                        <item.icon className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                                        <span className="text-xs font-medium text-slate-500 group-hover:text-slate-800">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <div className="flex items-center justify-center pt-8 text-slate-300 select-none">
                    <p className="text-[10px] tracking-[0.3em] font-bold uppercase transition-opacity duration-300">
                        Finlowly Core v1.0 • Made with ❤️
                    </p>
                </div>
            </div>
        </div>
    );
}
