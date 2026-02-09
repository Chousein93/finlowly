# PERSONAL FINANCE DASHBOARD — UI ONLY SPECIFICATION

## 0. PROJE BAĞLAMI (GLOBAL CONTEXT)

**Project Name:** Finlowly  
**Type:** Web Application (UI Only)

**Language:** Turkish (TR) — All UI texts, labels, helper texts, empty states and navigation must be in Turkish.  
**Purpose:** Income & Expense planning için profesyonel, sade ve hatasız çalışan bir arayüz  
**Target:** Kodlama z.ai tarafından yapılacak  
**Stage:** MVP (UI + Interaction only)

### ❌ KAPSAM DIŞI (ŞİMDİLİK)
- Backend
- Supabase
- Authentication
- Payment system
- Real calculations
- API entegrasyonları

### ✅ KAPSAM İÇİ
- Layout
- UI components
- Drag & Drop behavior
- Dashboard structure
- Templates & Library system
- Empty states
- Responsive behavior

---

## 1. UI FRAMEWORK & MCP ZORUNLULUĞU

### MCP TOOL (ZORUNLU)
Tüm UI bileşenleri **21st-dev / cline MCP** kullanılarak oluşturulmalıdır.

Kurulum:
```bash
npx -y @21st-dev/cli@latest install cline --api-key "b3b92bf3245ec61172ee71d9ede1cf9e0c4a8f014157224d2dd7c7e479339d41"
```

### UI PRENSİPLERİ
- Minimal
- Card-based
- Soft shadows
- Rounded corners
- Net spacing
- Açık boş durum (empty state) mesajları
- Dummy data YOK (sadece placeholder)

---

## 2. GLOBAL LAYOUT & STRUCTURE (PROMPT 1)

### Genel Yapı
Desktop-first, responsive yapı.

#### 3 Ana Alan:
1. **Left Sidebar**
2. **Main Content Area**
3. **Right Utility Panel**

---

### 2.1 LEFT SIDEBAR (Navigation)

**İçerik:**
- Logo / App Name (Finlowly) (üstte)
- Menü öğeleri:
  - Overview
  - Templates
  - Library
  - Goals
  - Settings

**Davranış:**
- Collapsible (expanded / icon-only)
- Desktop: default açık
- Mobile: hamburger menu
- Active state vurgusu

---

### 2.2 MAIN CONTENT AREA

#### Üst Bölüm — Performance Overview
- Placeholder chart (gerçek data yok)
- Card yapısı
- Helper text: “Data will appear here”

#### Orta Bölüm — Templates Preview
- Boş kartlar
- Empty state: “No templates yet”
- CTA yok (sadece placeholder)

#### Alt Bölüm — Dashboard Widgets Area
- Grid yapısı
- Drag & drop kabul eden alan
- Empty state mesajı:
  > “Drag templates here to build your dashboard”

---

### 2.3 RIGHT UTILITY PANEL

**Quick Stats (placeholder):**
- Total Income
- Total Expenses
- Remaining Balance

**Recent Activity:**
- Empty list
- Text: “No recent activity yet”

---

## 3. TEMPLATES SYSTEM (PROMPT 2)

### Templates Tanımı
Kullanıcının dashboard’a ekleyebileceği **ön tanımlı widget şablonlarıdır**.

### Templates Page UI
- Grid layout
- Her template bir card:
  - Icon
  - Title
  - Short description
  - “Add to Library” button

### Kurallar
- Sadece UI
- Click → Library’ye eklenmiş gibi görünür
- Gerçek veri YOK

---

## 4. LIBRARY SYSTEM (PROMPT 3)

### Library Tanımı
Kullanıcının sahip olduğu template’lerin listesi.

### Library UI
- Ana içerik alanında liste/grid
- Draggable cards
- Hover state: “Drag to Dashboard”

### Drag Davranışı
- Drag source: Library
- Drop target: Dashboard widget area
- Successful drop sonrası:
  - Dashboard’da widget görünür
  - Library’de kalmaya devam eder (kopyalama mantığı)

---

## 5. DASHBOARD WIDGET SYSTEM (PROMPT 4)

### Dashboard Alanı
- Grid-based layout
- Widget’lar reorder edilebilir
- Resize YOK (şimdilik)

### Widget Card İçeriği
- Header (title)
- Placeholder body
- Actions:
  - Remove (X icon)
  - Drag handle

### Empty State (ZORUNLU)
Metin:
> “Your dashboard is empty. Drag templates from the Library to get started.”

---

## 6. DRAG & DROP RULES

- Smooth animation
- Visual feedback (hover, shadow)
- Invalid drop alanlarında reddet
- Mobile: drag yerine tap + add (UI only)

---

## 7. UX & UI RULES (GLOBAL)

- Clear spacing
- Max 3 font-size hierarchy
- Neutral color palette
- Dikkat dağıtan animasyon yok
- Tüm empty state’ler açıklayıcı olmalı
- Dummy number YOK

---

## 8. IMPLEMENTATION RULES (Z.AI İÇİN KRİTİK)

Her adım şu sırayla yapılmalı:
1. Scope dışına çıkma
2. Sadece UI + behavior
3. Küçük ve geri alınabilir değişiklikler

Her adım sonunda ZORUNLU ÇIKTILAR:

### Acceptance Criteria (AC)
- Maddeler halinde
- Test edilebilir

### User Stories
Format:
> As a user, I can …

### Dosya Özeti
- Değişen component’ler
- Yeni eklenen dosyalar

### Son Satır (ZORUNLU)
```
COMPLETED
```

---

## 9. GELİŞTİRME SIRASI (DEĞİŞTİRİLEMEZ)

1. Global layout
2. Sidebar
3. Overview placeholders
4. Templates UI
5. Library UI
6. Drag & Drop (Library → Dashboard)
7. Dashboard widget management

---

## 10. NOTLAR

- Hesaplama YOK
- Data bağlantısı YOK
- Backend YOK
- Bu doküman UI kontratıdır
- Backend daha sonra eklenecek

---

## 11. DİL & MARKA KURALLARI (ZORUNLU)

- Uygulamanın **tamamı Türkçe** olacaktır
- İngilizce kelime, placeholder veya helper text KULLANILMAYACAK
- Menü isimleri Türkçe olacak:
  - Overview → Genel Bakış
  - Templates → Şablonlar
  - Library → Kütüphane
  - Goals → Hedefler
  - Settings → Ayarlar

### Marka: Finlowly
- Ton: sade, güven veren, modern
- Finans dili: karmaşık olmayan, kullanıcı dostu
- Logo metin tabanlı olabilir (ikon zorunlu değil)

END OF DOCUMENT

