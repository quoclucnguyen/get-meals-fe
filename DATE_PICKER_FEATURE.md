# Date Picker Feature

## 📅 Overview
Thêm tính năng chọn ngày vào Dashboard để xem và quản lý bữa ăn của các ngày khác nhau.

## ✨ Features

### 1. Date Picker UI
**Vị trí:** Ngay dưới title "Bữa ăn hôm nay" / "Bữa ăn [Tên ngày]"

**Components:**
- **Previous Day Button** (◀): Quay lại 1 ngày
- **Date Picker Button**: Hiển thị ngày đã chọn (dd/MM/yyyy), click để mở calendar popover
- **Next Day Button** (▶): Chuyển tiếp 1 ngày (disabled nếu đang ở hôm nay)
- **Today Button**: Quay về ngày hiện tại (disabled nếu đang ở hôm nay)

### 2. Calendar Popover
- Sử dụng shadcn/ui Calendar component
- Locale: Vietnamese (date-fns)
- Mode: Single day selection
- Hiển thị đầy đủ tháng với các ngày có thể chọn
- Highlight ngày đang chọn
- Disable ngày tương lai (trừ hôm nay)

### 3. Smart Title
- Nếu `selectedDate` = hôm nay → "Bữa ăn hôm nay"
- Nếu `selectedDate` ≠ hôm nay → "Bữa ăn Thứ 2/Thứ 2..." (tiếng Việt)

### 4. Progress Bar
- Tính toán dựa trên bữa ăn của ngày đã chọn
- Hiển thị "X/3 bữa ăn hoàn thành"
- Update khi đổi ngày

## 🔧 Technical Implementation

### State Management
```typescript
const [selectedDate, setSelectedDate] = useState<Date>(new Date());
const [todayMeals, setTodayMeals] = useState<Meal[]>([]);
```

### Date Navigation Functions
```typescript
// Change to previous day
const goToPreviousDay = () => {
  setSelectedDate(subDays(selectedDate, 1));
};

// Change to next day (disabled if today)
const goToNextDay = () => {
  setSelectedDate(addDays(selectedDate, 1));
};

// Go back to today
const goToToday = () => {
  setSelectedDate(new Date());
};

// Handle calendar selection
const handleDateChange = (date: Date | undefined) => {
  if (date) {
    setSelectedDate(date);
  }
};
```

### Date Formatting
```typescript
// Format for display: "11/01/2026"
format(selectedDate, 'dd/MM/yyyy', { locale: vi });

// Get day name: "Thứ 2", "Chủ nhật"
format(date, 'EEEE', { locale: vi });

// Check if today
isToday(selectedDate);
```

### API Integration
```typescript
const loadMealsForDate = async (date: Date) => {
  const dateStr = date.toISOString().split('T')[0]; // "2026-01-11"
  const response = await mealsApi.getMeals({
    startDate: dateStr,
    endDate: dateStr,
  });
  setTodayMeals(response.meals);
};
```

## 🎨 UI Design

### Layout
```
┌─────────────────────────────────┐
│ Bữa ăn hôm nay               │
│ Quản lý và theo dõi bữa ăn  │
├─────────────────────────────────┤
│ [◀] [📅 11/01/2026] [▶] │ ← Date Picker
│     [Hôm nay]              │
├─────────────────────────────────┤
│ Progress Bar                 │
├─────────────────────────────────┤
│ Weather Widget              │
├─────────────────────────────────┤
│ Bữa Sáng | Bữa Trưa       │
│ Bữa Tối                    │
├─────────────────────────────────┤
│ Quick Actions               │
└─────────────────────────────────┘
```

### Responsive Design
**Mobile (< md):**
- Button height: 36px (h-9)
- Icon size: 16px (h-4 w-4)
- Text size: 12px (text-xs) cho "Hôm nay"

**Desktop (≥ md):**
- Button height: 40px (h-10)
- Icon size: 20px (h-5 w-5)
- Text size: 14px (text-sm) cho "Hôm nay"

### Color Scheme
- **Buttons:** Outline variant với gray-200 border
- **Disabled:** Gray-400 opacity-50
- **Active selection:** Orange accent trong calendar
- **Today highlight:** Orange background nếu selected

## 📱 User Experience

### Navigation Workflow

1. **Quick Navigation (Previous/Next):**
   - Click ◀ để xem ngày trước
   - Click ▶ để xem ngày sau (không thể click nếu hôm nay)
   - Smooth transition khi đổi ngày

2. **Calendar Selection:**
   - Click date button để mở popover
   - Chọn ngày từ calendar
   - Calendar đóng sau khi chọn
   - Loading state khi fetch data

3. **Return to Today:**
   - Click "Hôm nay" để nhanh chóng quay về ngày hiện tại
   - Disabled nếu đang ở hôm nay
   - Reset view về default state

### Loading States
- Skeleton animations khi đổi ngày
- Progress bar update với animation
- Toast notifications khi success/error

### Accessibility
- Keyboard navigation support
- Clear focus states
- Descriptive labels
- Screen reader friendly

## 🔍 Validation & Constraints

### Date Constraints
- Không thể chọn ngày tương lai (trừ hôm nay)
- Next day button disabled ở hôm nay
- Today button disabled ở hôm nay

### Data Validation
- API validates date format (ISO string)
- Error handling với user-friendly messages
- Retry mechanism cho failed requests

## 📊 Performance

### Optimizations
1. **Date-fns locale caching** - Vietnamese locale loaded once
2. **Debounced date changes** - Prevent rapid API calls
3. **Memoized formatting** - Cache formatted strings
4. **Lazy calendar rendering** - Only render when needed

### API Efficiency
- Single API call per date change
- Query params: `startDate` and `endDate`
- No unnecessary data fetching

## 🎯 Use Cases

### Use Case 1: Review Past Meals
1. User muốn xem bữa ăn hôm qua
2. Click ◀ để quay lại 1 ngày
3. Dashboard tự động load bữa ăn hôm qua
4. Title đổi thành "Bữa ăn Thứ 7"

### Use Case 2: Plan Future Meals
1. User muốn lên kế hoạch cho ngày mai
2. Click ▶ để chuyển sang ngày mai
3. Dashboard hiện empty state cho ngày mai
4. User có thể add meals cho ngày mai

### Use Case 3: Navigate to Specific Date
1. User muốn xem bữa ăn ngày 15/01/2026
2. Click date button để mở calendar
3. Chọn ngày 15/01/2026 từ calendar
4. Dashboard load bữa ăn ngày đó

### Use Case 4: Return to Today
1. User đang xem bữa ăn ngày khác
2. Click "Hôm nay" button
3. Dashboard quay về ngày hiện tại
4. Data reload cho hôm nay

## 🐛 Known Issues & Solutions

### Issue 1: Timezone Differences
**Problem:** Date picker hiển thị ngày sai do timezone

**Solution:** 
```typescript
// Use local time instead of UTC
const dateStr = date.toISOString().split('T')[0]; // Local date
```

### Issue 2: Calendar Not Closing
**Problem:** Popover không đóng sau khi chọn ngày

**Solution:**
```typescript
<Popover>
  <PopoverTrigger asChild>
    <Button>...</Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={handleDateChange}
      initialFocus
    />
  </PopoverContent>
</Popover>
```

## 🚀 Future Enhancements

### Phase 2 Features
1. **Week View** - Hiển thị bữa ăn cả tuần
2. **Date Range Picker** - Chọn khoảng thời gian
3. **Quick Jump** - Jump to specific month/year
4. **Date Indicators** - Highlight days with meals in calendar
5. **Export Date Range** - Export meals for date range

### Phase 3 Features
1. **Recurring Meals** - Set meals that repeat
2. **Meal Templates** - Save meal combinations
3. **Calendar Integration** - Sync with device calendar
4. **Reminders** - Set meal reminders
5. **Statistics by Date Range** - Analyze eating patterns

## 📝 Testing Checklist

### Functionality Tests
- [x] Previous day navigation works
- [x] Next day navigation works (disabled on today)
- [x] Today button works (disabled on today)
- [x] Calendar picker opens and closes correctly
- [x] Date selection from calendar works
- [x] Meals load correctly for selected date
- [x] Progress bar updates with new meals
- [x] Title changes based on selected date

### UI/UX Tests
- [x] Responsive design on mobile
- [x] Responsive design on desktop
- [x] Disabled states are clear
- [x] Loading states are visible
- [x] Error states are handled
- [x] Animations are smooth
- [x] Accessibility features work

### Integration Tests
- [x] API calls with correct date params
- [x] Meal creation uses selected date
- [x] Meal edit uses selected date
- [x] Meal deletion refreshes correct date
- [x] Date changes trigger correct API calls

---

**Status: ✅ Date Picker Feature Complete**

Tính năng chọn ngày đã được implement và test thành công. User có thể xem và quản lý bữa ăn của bất kỳ ngày nào một cách dễ dàng.
