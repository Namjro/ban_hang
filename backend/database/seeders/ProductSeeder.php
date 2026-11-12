<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categoriesData = [
            [
                'name' => 'Máy CNC & Máy Công Cụ',
                'subtitle' => 'GIA CÔNG CƠ KHÍ',
                'slug' => 'may-cnc-va-may-cong-cu',
                'description' => 'Máy tiện CNC, máy phay đứng, cưa vòng tự động và thiết bị gia công kim loại chất lượng cao.',
                'icon' => 'factory',
                'image_url' => '/assets/images/cat-cnc.png',
                'highlights' => [
                    ['label' => 'Thiết Bị', 'value' => 'Tiện, Phay, Cưa vòng, Mài phẳng'],
                    ['label' => 'Lựa Chọn Theo', 'value' => 'Tải trọng • Trục • Công suất'],
                ],
                'show_on_home' => true,
                'order' => 1,
                'products' => [
                    ['sku' => 'AX-CNC-VMC850', 'name' => 'Trung Tâm Gia Công Đứng CNC VMC-850', 'brand' => 'Axiom Precision', 'stock' => 'in_stock', 'featured' => true,
                     'specs' => ['Hành trình X/Y/Z' => '800x500x550 mm', 'Tốc độ trục chính' => '10.000 RPM', 'Côn trục chính' => 'BT40', 'Hệ điều khiển' => 'Fanuc 0i-MF Plus', 'Độ lặp lại' => '±0.003 mm']],
                    ['sku' => 'AX-CNC-LAT600', 'name' => 'Máy Tiện CNC Băng Nghiêng T-600', 'brand' => 'Axiom Precision', 'stock' => 'in_stock', 'featured' => true,
                     'specs' => ['Đường kính tiện max' => 'Ø360 mm', 'Chiều dài tiện max' => '550 mm', 'Tốc độ trục chính' => '4.500 RPM', 'Mâm cặp' => 'Thủy lực 8 inch']],
                    ['sku' => 'AX-SAW-BS350', 'name' => 'Máy Cưa Vòng Bán Tự Động BS-350', 'brand' => 'Axiom Machinery', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Khả năng cắt tròn' => 'Ø350 mm', 'Khả năng cắt hộp' => '350x320 mm', 'Công suất motor' => '3.0 kW', 'Tốc độ lưỡi' => '25-85 m/min']],
                    ['sku' => 'AX-EDM-400', 'name' => 'Máy Cắt Dây Molybdenum CNC DK7740', 'brand' => 'Axiom CNC', 'stock' => 'low_stock', 'featured' => false,
                     'specs' => ['Hành trình bàn' => '400x500 mm', 'Độ dày phôi max' => '300 mm', 'Độ nhám bề mặt' => 'Ra <= 1.2 um', 'Tốc độ cắt' => '120 mm2/min']],
                    ['sku' => 'AX-GRD-SGA3060', 'name' => 'Máy Mài Phẳng Thủy Lực SGA-3060', 'brand' => 'Falcon Precision', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Kích thước bàn' => '300x600 mm', 'Tải trọng bàn' => '300 kg', 'Khoảng cách trục đến bàn' => '500 mm', 'Độ chính xác mài' => '0.002 mm']],
                    ['sku' => 'AX-DRL-RD50', 'name' => 'Máy Khoan Cần Công Nghiệp RD-50', 'brand' => 'Vertex Industrial', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Đường kính khoan max' => 'Ø50 mm', 'Bán kính cần' => '1600 mm', 'Côn trục chính' => 'MT5', 'Công suất motor' => '4.0 kW']],
                    ['sku' => 'AX-CNC-VMC1100', 'name' => 'Trung Tâm Phay CNC Khổ Lớn VMC-1100', 'brand' => 'Axiom Precision', 'stock' => 'pre_order', 'featured' => true,
                     'specs' => ['Hành trình X/Y/Z' => '1100x650x600 mm', 'Tốc độ trục' => '12.000 RPM (Direct)', 'Băng dẫn hướng' => 'Con lăn tuyến tính Roller Guide']],
                    ['sku' => 'AX-LAT-CONV400', 'name' => 'Máy Tiện Vạn Năng Cơ Khí CD-400', 'brand' => 'Axiom Machinery', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Đường kính tiện' => 'Ø400 mm', 'Chiều dài chống tâm' => '1000 mm', 'Lỗ trục chính' => 'Ø52 mm', 'Dải tốc độ' => '18 cấp (32-1800 rpm)']],
                    ['sku' => 'AX-MILL-UNIV3', 'name' => 'Máy Phay Vạn Năng Đầu Vạn Hướng UH-3', 'brand' => 'Vertex Industrial', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Kích thước bàn' => '320x1370 mm', 'Góc xoay đầu phay' => '360 độ', 'Trục phay ngang/đứng' => 'Độc lập ISO40']],
                ]
            ],
            [
                'name' => 'Dụng Cụ Cắt Gọt',
                'subtitle' => 'DỤNG CỤ CẮT GỌT',
                'slug' => 'dung-cu-cat-got',
                'description' => 'Mảnh hợp kim carbide, dao phay ngón siêu bền, mũi khoan taro phủ TiAlN cho thép và inox.',
                'icon' => 'crosshair',
                'image_url' => '/assets/images/cat-cutting.png',
                'highlights' => [
                    ['label' => 'Dòng Sản Phẩm', 'value' => 'Mảnh hợp kim, Dao phay ngón, Mũi khoan'],
                    ['label' => 'Lựa Chọn Theo', 'value' => 'Vật liệu • Đường kính • Lớp phủ'],
                ],
                'show_on_home' => true,
                'order' => 2,
                'products' => [
                    ['sku' => 'AX-EM-4FL-10', 'name' => 'Dao Phay Ngón Hợp Kim 4 Me Ø10mm Phủ TiAlN', 'brand' => 'Axiom Tooling', 'stock' => 'in_stock', 'featured' => true,
                     'specs' => ['Đường kính cán' => 'Ø10 mm', 'Độ cứng gia công' => 'Lên đến 55 HRC', 'Góc xoắn' => '35 độ', 'Lớp phủ' => 'AlTiN Nano-structure']],
                    ['sku' => 'AX-EM-2FL-06', 'name' => 'Dao Phay Ngón Phay Nhôm 2 Me Cắt Ø6mm DLC', 'brand' => 'Axiom Tooling', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Đường kính' => 'Ø6 mm', 'Lớp phủ' => 'Kim cương nhân tạo DLC', 'Vật liệu áp dụng' => 'Nhôm 6061, 7075, Đồng đỏ', 'Góc xoắn' => '45 độ']],
                    ['sku' => 'AX-INS-CNMG120408', 'name' => 'Mảnh Tiện Hợp Kim CNMG 120408 Chuyên Inox', 'brand' => 'Sandvik Coromant', 'stock' => 'in_stock', 'featured' => true,
                     'specs' => ['Hình dạng' => 'Hình thoi 80 độ', 'Bán kính mũi r' => '0.8 mm', 'Vật liệu gia công' => 'Thép không gỉ (Inox 304/316)', 'Lớp phủ' => 'CVD PVD Hybrid']],
                    ['sku' => 'AX-INS-WNMG080408', 'name' => 'Mảnh Tiện Tam Giác Đọt WNMG 080408 Gia Công Thép', 'brand' => 'Kyocera', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Số góc cắt' => '6 góc cắt', 'Bán kính mũi r' => '0.8 mm', 'Vật liệu gia công' => 'Thép Carbon S45C, SCM440', 'Độ sâu cắt' => '0.5 - 4.5 mm']],
                    ['sku' => 'AX-DRL-CARB08', 'name' => 'Mũi Khoan Hợp Kim Nguyên Khối Ø8.5mm Có Lỗ Nước', 'brand' => 'Nachi-Fujikoshi', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Đường kính' => 'Ø8.5 mm', 'Chiều dài rãnh' => '5D (45 mm)', 'Làm mát trong' => 'Hai lỗ thoát dầu xuyên tâm', 'Lớp phủ' => 'Aqua REVO']],
                    ['sku' => 'AX-TAP-M10X1.5', 'name' => 'Mũi Taro Rãnh Xoắn Thép Gió HSS-E M10x1.5', 'brand' => 'YAMAWA', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Kích thước ren' => 'M10 x 1.5', 'Cấp chính xác' => 'P3 (ISO2 / 6H)', 'Vật liệu' => 'HSS-E phủ Nitride', 'Ứng dụng' => 'Lỗ bít mù cho thép và inox']],
                    ['sku' => 'AX-FML-KM12-50', 'name' => 'Đài Dao Phay Mặt Khỏa Góc 45 Độ BAP 400R-50-22', 'brand' => 'Axiom Tooling', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Đường kính đài dao' => 'Ø50 mm', 'Lỗ trục gá' => '22 mm', 'Số chíp gắn' => '4 răng (Insert APMT1604)', 'Góc cắt' => '90 độ khỏa góc đứng']],
                    ['sku' => 'AX-BN-R3X6', 'name' => 'Dao Phay Cầu Carbide 2 Me R3x6x50L', 'brand' => 'Axiom Tooling', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Bán kính đầu cầu' => 'R3 mm (Ø6)', 'Chiều dài tổng' => '50 mm', 'Độ cứng phôi' => '60 HRC', 'Gia công' => 'Lòng khuôn mẫu 3D chính xác']],
                    ['sku' => 'AX-CRM-H7-12', 'name' => 'Dao Doa Máy Chuôi Trụ Carbide H7 Ø12mm', 'brand' => 'Axiom Tooling', 'stock' => 'low_stock', 'featured' => false,
                     'specs' => ['Cấp dung sai' => 'H7 (0 to +0.018mm)', 'Đường kính doa' => 'Ø12.00 mm', 'Số me cắt' => '6 me thẳng', 'Vật liệu' => 'Solid Carbide Siêu Mịn']],
                ]
            ],
            [
                'name' => 'Dụng Cụ Đo Lường Chính Xác',
                'subtitle' => 'ĐO LƯỜNG CHÍNH XÁC',
                'slug' => 'do-luong-chinh-xac',
                'description' => 'Thước kẹp điện tử, panme đo ngoài, đồng hồ so kiểm tra độ đảo chuẩn Mitutoyo với đầy đủ CO/CQ.',
                'icon' => 'scan-line',
                'image_url' => '/assets/images/cat-measuring.png',
                'highlights' => [
                    ['label' => 'Thiết Bị Đo', 'value' => 'Thước kẹp, Panme, Đồng hồ so'],
                    ['label' => 'Lựa Chọn Theo', 'value' => 'Phạm vi đo • Độ phân giải • Độ chính xác'],
                ],
                'show_on_home' => true,
                'order' => 3,
                'products' => [
                    ['sku' => 'AX-PM-150', 'name' => 'Thước Kẹp Điện Tử Đo Trong Ngoài 0-150mm IP67', 'brand' => 'Mitutoyo', 'stock' => 'in_stock', 'featured' => true,
                     'specs' => ['Phạm vi đo' => '0 – 150 mm (0 - 6 inch)', 'Độ phân giải' => '0.01 mm (0.0005 inch)', 'Độ chính xác' => '±0.02 mm', 'Tiêu chuẩn bảo vệ' => 'Chống nước kháng dầu IP67', 'Xuất xứ' => 'Nhật Bản (CO/CQ chính hãng)']],
                    ['sku' => 'AX-MIC-025', 'name' => 'Panme Đo Ngoài Cơ Khí Chính Xác 0-25mm 0.001mm', 'brand' => 'Mitutoyo', 'stock' => 'in_stock', 'featured' => true,
                     'specs' => ['Phạm vi đo' => '0 – 25 mm', 'Độ chia du xích' => '0.001 mm', 'Mặt tiếp xúc' => 'Hợp kim Tungsten Carbide', 'Lực đo định chuẩn' => '5 - 10 N có cóc bánh cóc']],
                    ['sku' => 'AX-DIAL-001', 'name' => 'Đồng Hồ So Cơ Khí Chống Sốc Chân Gập 0-0.8mm', 'brand' => 'Mitutoyo', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Phạm vi đo' => '0.8 mm', 'Vạch chia' => '0.01 mm', 'Đường kính mặt kim' => 'Ø40 mm', 'Chân đo' => 'Góc gập đảo chiều đính bi ruby']],
                    ['sku' => 'AX-MAG-STD', 'name' => 'Đế Từ Gá Đồng Hồ So Đòn Bẩy Đa Hướng Lực Hút 80kg', 'brand' => 'Noga Engineering', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Lực giữ nam châm' => '80 kgf (800N)', 'Bán kính với tới' => '317 mm', 'Khóa trung tâm' => 'Khóa thủy lực 1 núm vặn', 'Ren chân đế' => 'M8 x 1.25']],
                    ['sku' => 'AX-HG-300', 'name' => 'Thước Đo Cao Điện Tử Kỹ Thuật Số 0-300mm', 'brand' => 'Mitutoyo', 'stock' => 'low_stock', 'featured' => false,
                     'specs' => ['Phạm vi đo' => '0 - 300 mm', 'Độ phân giải' => '0.01 mm', 'Thân thước' => 'Trụ đôi vững chắc chống biến dạng', 'Mũi vạch dấu' => 'Hợp kim Carbide vát nhọn']],
                    ['sku' => 'AX-BLOK-47P', 'name' => 'Bộ Căn Mẫu Chuẩn Cơ Khí Cấp 1 Bộ 47 Miếng Thép Gió', 'brand' => 'Axiom Metrology', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Số lượng tấm' => '47 khối căn mẫu', 'Cấp độ chính xác' => 'Grade 1 (ISO 3650)', 'Độ cứng bề mặt' => '>= 800 HV', 'Hộp đựng' => 'Hộp gỗ chuyên dụng chống ẩm']],
                    ['sku' => 'AX-RUG-SJ210', 'name' => 'Máy Đo Độ Nhám Bề Mặt Cầm Tay Di Động SJ-210', 'brand' => 'Mitutoyo', 'stock' => 'pre_order', 'featured' => true,
                     'specs' => ['Thông số đo' => 'Ra, Rz, Rq, Ry, Rp, Rmax...', 'Màn hình' => 'Màu LCD 2.4 inch đồ họa', 'Đầu dò kim' => 'Mũi kim cương bán kính 2 um', 'Tiêu chuẩn' => 'JIS, ISO, ANSI, VDA']],
                    ['sku' => 'AX-PG-M8-6H', 'name' => 'Dưỡng Kiểm Ren Trục Trong Go/NoGo M8x1.25 Cấp 6H', 'brand' => 'Sokuhansha', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Quy cách ren' => 'M8 x 1.25', 'Cấp dung sai' => '6H', 'Kiểu kiểm tra' => 'Đầu đi qua (GO) và Đầu chặn (NOGO)', 'Vật liệu' => 'Thép đo lường tôi thấm cacbon']],
                    ['sku' => 'AX-LVL-OPT200', 'name' => 'Thước Thủy Cân Bằng Độ Nghiêng Khung Vuông 200x200mm', 'brand' => 'Axiom Metrology', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Kích thước khung' => '200 x 200 x 42 mm', 'Độ nhạy bóng bọt' => '0.02 mm/m (4 giây góc)', 'Mặt đế vát chữ V' => 'Dùng cân bằng cả mặt phẳng và mặt trụ tròn']],
                ]
            ],
            [
                'name' => 'Gá Đặt & Phụ Kiện Máy',
                'subtitle' => 'GÁ ĐẶT & ĐỒ GÁ',
                'slug' => 'ga-dat-va-phu-kien-may',
                'description' => 'Ê tô máy CNC Vertex, bầu kẹp dao BT40/ER32, mâm cặp 3 chấu thủy lực và bàn xoay chia độ.',
                'icon' => 'boxes',
                'image_url' => '/assets/images/cat-fixture.png',
                'highlights' => [
                    ['label' => 'Phụ Kiện', 'value' => 'Ê tô thủy lực, Bầu kẹp BT40, Mâm cặp'],
                    ['label' => 'Lựa Chọn Theo', 'value' => 'Lực kẹp • Chuẩn côn • Khả năng gá'],
                ],
                'show_on_home' => true,
                'order' => 4,
                'products' => [
                    ['sku' => 'AX-WH-100', 'name' => 'Ê Tô Máy Phay Cơ Khí Thủy Lực Lực Kẹp Khỏe VH-100', 'brand' => 'Vertex', 'stock' => 'in_stock', 'featured' => true,
                     'specs' => ['Chiều rộng hàm kẹp' => '100 mm', 'Độ mở hàm max' => '170 mm', 'Lực kẹp thủy lực' => '2500 kgf', 'Độ song song' => '0.01 mm / 100mm']],
                    ['sku' => 'AX-HLD-BT40-ER32', 'name' => 'Bầu Kẹp Dao Phay BT40 Chuẩn ER32 L=70mm Cân Bằng Động', 'brand' => 'Axiom Tooling', 'stock' => 'in_stock', 'featured' => true,
                     'specs' => ['Chuẩn chuôi côn' => 'BT40 (MAS 403)', 'Kẹp Collet' => 'ER32 (Khả năng kẹp Ø2-Ø20 mm)', 'Cân bằng động' => 'G2.5 @ 25.000 RPM', 'Độ đảo trục' => '<= 0.003 mm']],
                    ['sku' => 'AX-COL-ER32-SET', 'name' => 'Bộ Đầu Kẹp Collet ER32 Siêu Chính Xác 18 Chi Tiết (Ø3-Ø20)', 'brand' => 'Vertex', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Số lượng collet' => '18 chi tiết', 'Dung sai đảo' => '0.005 mm (Chuẩn UP)', 'Vật liệu' => 'Thép đàn hồi cao cấp tôi nhiệt 44-48 HRC']],
                    ['sku' => 'AX-CHK-SC8', 'name' => 'Mâm Cặp 3 Chấu Tự Định Tâm 8 Inch SC-8 Kèm 2 Bộ Chấu', 'brand' => 'Vertex Industrial', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Đường kính ngoài' => 'Ø200 mm (8 inch)', 'Lỗ thông suốt' => 'Ø55 mm', 'Dải kẹp ngoài' => 'Ø10 - Ø190 mm', 'Bộ chấu kèm theo' => '1 bộ chấu thuận + 1 bộ chấu nghịch']],
                    ['sku' => 'AX-TBL-RT200', 'name' => 'Bàn Xoay Chia Độ Phay Đứng Ngang 8 Inch HV-8', 'brand' => 'Vertex', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Đường kính mâm xoay' => 'Ø200 mm', 'Tỷ số truyền trục vít' => '1:90', 'Độ chia đĩa' => '360 độ (Khắc micro 1 phút)', 'Sử dụng' => 'Đặt đứng hoặc nằm ngang']],
                    ['sku' => 'AX-VBL-100', 'name' => 'Khối V Từ Tính Gá Phôi Trụ Cặp Đôi V-100mm Lực Hút Khỏe', 'brand' => 'Axiom Fixture', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Kích thước' => '100 x 50 x 80 mm (Cặp 2 cục)', 'Đường kính phôi kẹp' => 'Ø5 - Ø65 mm', 'Lực giữ từ tính' => '80 kgf', 'Độ phẳng song song' => '0.005 mm']],
                    ['sku' => 'AX-KCK-58P', 'name' => 'Bộ Gá Kẹp Phôi Bàn Máy Phay Rãnh Chữ T 58 Món M12/T14', 'brand' => 'Axiom Fixture', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Rãnh bàn máy T-Slot' => '14 mm', 'Bu lông ren' => 'M12 cường độ cao 8.8', 'Thành phần' => 'Khối bậc, mỏ kẹp dẹp, đai ốc nối, bu lông đủ cỡ']],
                    ['sku' => 'AX-EDF-ME10', 'name' => 'Đầu Dò Tìm Mép Phôi Cơ Khí Chống Nhiễm Từ ME-1020', 'brand' => 'Vertex', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Đường kính chuôi' => 'Ø10 mm', 'Đầu bi tiếp xúc' => 'Ø10 mm và Ø4 mm', 'Độ chính xác định tâm' => '±0.002 mm', 'Tốc độ quay đề xuất' => '400 - 600 RPM']],
                    ['sku' => 'AX-PULL-BT40-45', 'name' => 'Vít Rút Bầu Kẹp Dao Phay CNC BT40 Góc Nghiêng 45 Độ', 'brand' => 'Axiom Tooling', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Góc đầu rút' => '45 độ (Chuẩn MAS 403-P40T-I)', 'Ren bắt bầu kẹp' => 'M16 x 2.0', 'Xử lý bề mặt' => 'Nhuộm đen tôi cứng chống nứt vỡ']],
                ]
            ],
            [
                'name' => 'Bạc Đạn & Truyền Động Tuyến Tính',
                'subtitle' => 'TRUYỀN ĐỘNG CƠ KHÍ',
                'slug' => 'bac-dan-va-truyen-dong',
                'description' => 'Ổ bi cầu rãnh sâu, bạc đạn đỡ chặn trục chính CNC, con trượt thanh trượt vuông chính xác.',
                'icon' => 'crosshair',
                'image_url' => '/assets/images/cat-bearing.png',
                'highlights' => [
                    ['label' => 'Sản Phẩm', 'value' => 'Vòng bi cầu, Bạc đạn đỡ chặn, Ray trượt'],
                    ['label' => 'Lựa Chọn Theo', 'value' => 'Đường kính trục • Tải trọng • Cấp chính xác'],
                ],
                'show_on_home' => true,
                'order' => 5,
                'products' => [
                    ['sku' => 'AX-BR-6205-2RS', 'name' => 'Vòng Bi Bạc Đạn Cầu Rãnh Sâu 6205-2RS Nắp Cao Su', 'brand' => 'SKF', 'stock' => 'in_stock', 'featured' => true,
                     'specs' => ['Đường kính trong d' => '25 mm', 'Đường kính ngoài D' => '52 mm', 'Độ dày B' => '15 mm', 'Nắp chặn dầu' => 'Hai nắp cao su NBR chống bụi bẩn', 'Tải trọng động C' => '14.8 kN']],
                    ['sku' => 'AX-BR-7008-ACD', 'name' => 'Bạc Đạn Đỡ Chặn Trục Chính Máy CNC 7008-ACD/P4A Cặp Đôi', 'brand' => 'NSK', 'stock' => 'in_stock', 'featured' => true,
                     'specs' => ['Kích thước' => '40 x 68 x 15 mm', 'Góc tiếp xúc' => '25 độ (ACD)', 'Cấp độ chính xác' => 'P4A (Siêu chính xác trục chính CNC)', 'Tốc độ mỡ' => '24.000 RPM']],
                    ['sku' => 'AX-LGD-HGR25', 'name' => 'Thanh Trượt Dẫn Hướng Tuyến Tính Vuông HGR25 L=1000mm', 'brand' => 'HIWIN', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Bề rộng ray trượt' => '23 mm', 'Chiều cao ray' => '22 mm', 'Chiều dài tiêu chuẩn' => '1000 mm (Cắt theo yêu cầu)', 'Cấp chính xác' => 'H (High precision)']],
                    ['sku' => 'AX-LBLK-HGH25CA', 'name' => 'Con Trượt Vuông Tải Trọng Nặng HGH25CA Bích Nhỏ', 'brand' => 'HIWIN', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Khối trượt dùng cho ray' => 'HGR25', 'Tải trọng động C' => '26.4 kN', 'Hệ thống bôi trơn' => 'Núm mỡ đồng ren M6 thẳng', 'Tự lựa 4 hướng' => 'Có']],
                    ['sku' => 'AX-BSW-DFU2505', 'name' => 'Trục Vít Me Bi Đai Ốc Đôi Siêu Mịn DFU2505 Bước 5mm L=1200mm', 'brand' => 'TBI Motion', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Đường kính trục' => 'Ø25 mm', 'Bước ren ren Lead' => '5 mm', 'Cấp chính xác' => 'C7 (Đã tôi cứng tôi mài)', 'Khử rơ lắc' => 'Đai ốc đôi đệm tải trước']],
                    ['sku' => 'AX-BK-BF15', 'name' => 'Gối Đỡ Trục Vít Me Bi Cố Định Đầu Đỡ BK15 và BF15', 'brand' => 'THK', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Đường kính lỗ bạc đạn' => 'Ø15 mm', 'Bên cố định (BK)' => 'Chứa cặp vòng bi góc đỡ chặn lực dọc trục', 'Bên tự do (BF)' => 'Vòng bi cầu đỡ tâm trục']],
                    ['sku' => 'AX-CPL-D40L50', 'name' => 'Khớp Nối Mềm Nhôm Hàm Đệm Cao Su Giảm Chấn D40L50 Ø12xØ14', 'brand' => 'Axiom Motion', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Đường kính ngoài' => 'Ø40 mm', 'Chiều dài khớp' => '50 mm', 'Lỗ trục kết nối' => 'Ø12 mm x Ø14 mm', 'Mô-men xoắn định mức' => '19 N.m']],
                    ['sku' => 'AX-TR-UCFL205', 'name' => 'Gối Đỡ Bạc Đạn Hình Quả Trám 2 Lỗ Bắt Bulong UCFL 205', 'brand' => 'ASAHI', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Đường kính trục lọt' => 'Ø25 mm', 'Khoảng cách tâm lỗ' => '99 mm', 'Vật liệu vỏ gối' => 'Gang đúc xám dẻo tiêu chuẩn', 'Khóa trục' => '2 vít trí lục giác chìm']],
                    ['sku' => 'AX-LM-20UU', 'name' => 'Bạc Đạn Trượt Tuyến Tính Trục Tròn LM20UU Bọc Thép', 'brand' => 'Axiom Motion', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Đường kính trục' => 'Ø20 mm', 'Đường kính ngoài' => '32 mm', 'Chiều dài' => '42 mm', 'Số rãnh bi tuần hoàn' => '5 hàng bi chạy êm ái']],
                ]
            ],
            [
                'name' => 'Bôi Trơn & Khí Nén',
                'subtitle' => 'VẬT TƯ TIÊU HAO',
                'slug' => 'boi-tron-va-khi-nen',
                'description' => 'Dầu tưới nguội làm mát cắt gọt pha nước, bộ lọc khí nén SMC và van điện từ công nghiệp.',
                'icon' => 'truck',
                'image_url' => '/assets/images/cat-pneumatic.png',
                'highlights' => [
                    ['label' => 'Dung Dịch & Thiết Bị', 'value' => 'Dầu tưới nguội pha nước, Bộ lọc khí, Van SMC'],
                    ['label' => 'Lựa Chọn Theo', 'value' => 'Độ nhớt • Tỷ lệ pha • Áp suất làm việc'],
                ],
                'show_on_home' => true,
                'order' => 6,
                'products' => [
                    ['sku' => 'AX-LUB-EMUL20L', 'name' => 'Dầu Làm Mát Cắt Gọt Kim Loại Pha Nước Bán Tổng Hợp Thùng 20L', 'brand' => 'Castrol Hysol', 'stock' => 'in_stock', 'featured' => true,
                     'specs' => ['Quy cách đóng gói' => 'Xô 20 Lít (Có phuy 209L)', 'Tỷ lệ pha khuyến nghị' => '5 - 8% với nước sạch', 'Đặc tính' => 'Chống tạo bọt, chống gỉ sét phôi, không mùi hôi', 'Xuất xứ' => 'Thái Lan']],
                    ['sku' => 'AX-OIL-WAY68', 'name' => 'Dầu Bôi Trơn Rãnh Trượt Băng Máy Công Cụ ISO VG 68 20L', 'brand' => 'Mobil Vactra No.2', 'stock' => 'in_stock', 'featured' => true,
                     'specs' => ['Cấp độ nhớt' => 'ISO VG 68', 'Đặc tính kết dính' => 'Phụ gia bám dính ngăn trượt giật (Stick-slip)', 'Ứng dụng' => 'Băng dẫn hướng máy tiện, phay CNC']],
                    ['sku' => 'AX-FRL-AC3000', 'name' => 'Bộ Lọc Đôi Tách Nước Điều Áp Bôi Trơn Khí Nén AC3000-03', 'brand' => 'SMC Pneumatics', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Kích thước cổng ren' => 'G 3/8 inch', 'Áp suất làm việc' => '0.05 – 0.85 MPa (Lên đến 8.5 bar)', 'Cốc xả nước' => 'Xả bán tự động kèm đồng hồ đo áp']],
                    ['sku' => 'AX-SOL-4V210', 'name' => 'Van Điện Từ Khí Nén 5 Cửa 2 Vị Trí 4V210-08 Cuộn Hút 24VDC', 'brand' => 'Airtac', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Cấu hình van' => '5/2 Single Solenoid Pilot', 'Kích thước ren cấp' => 'G 1/4 inch (Ren xả G 1/8)', 'Điện áp điều khiển' => '24V DC (Có đèn LED báo nguồn)', 'Tần số đóng mở max' => '5 chu kỳ/giây']],
                    ['sku' => 'AX-CYL-SC50X100', 'name' => 'Xylanh Khí Nén Vuông Tiêu Chuẩn ISO SC50x100 Hành Trình 100mm', 'brand' => 'Airtac', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Đường kính nòng nòng' => 'Ø50 mm', 'Hành trình Piston' => '100 mm', 'Giảm chấn khí nén' => 'Điều chỉnh được ở cả 2 đầu', 'Áp suất thử nghiệm' => '1.5 MPa']],
                    ['sku' => 'AX-TUBE-PU0850', 'name' => 'Ống Hơi Dẫn Khí Nén Polyurethane PU Ø8xØ5.0mm Cuộn 100 Mét', 'brand' => 'Pisco Japan', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Đường kính ngoài/trong' => '8 mm x 5 mm', 'Chiều dài đóng gói' => 'Cuộn 100 mét', 'Màu sắc' => 'Trong suốt / Xanh coban / Đen', 'Áp suất nổ' => '2.5 MPa ở 20 độ C']],
                    ['sku' => 'AX-NOZ-COOL12', 'name' => 'Vòi Phun Dầu Nước Tưới Nguội Khớp Nối Mềm Dẻo Ren 1/2 Inch', 'brand' => 'Loc-Line', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Đường kính trong vòi' => '1/2 inch', 'Chiều dài vòi' => '400 mm kèm van khóa đồng', 'Đầu phun' => 'Đầu dẹt và đầu tròn thay đổi linh hoạt', 'Chất liệu' => 'Nhựa Acetal chống ăn mòn dầu hóa chất']],
                    ['sku' => 'AX-GRS-EP2', 'name' => 'Mỡ Bôi Trơn Vòng Bi Kháng Nước Chịu Cực Áp EP 2 Tuýp 400g', 'brand' => 'Shell Gadus S2', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Độ nhớt mỡ NLGI' => 'Cấp 2', 'Chất làm đặc' => 'Xà phòng Lithium cải tiến', 'Dải nhiệt độ vận hành' => '-20 đến +130 độ C', 'Ứng dụng' => 'Trục tải nặng, bạc đạn máy công nghiệp']],
                    ['sku' => 'AX-GUN-AIR100', 'name' => 'Súng Thổi Khí Nén Vệ Sinh Bụi Mạt Sắt Kim Loại Đầu Vòi Dài', 'brand' => 'Axiom Tooling', 'stock' => 'in_stock', 'featured' => false,
                     'specs' => ['Chiều dài đầu phun' => '120 mm ống thép mạ crom', 'Cò bấm điều chỉnh' => 'Tự điều chỉnh lưu lượng gió mạnh nhẹ', 'Chuôi cắm nhanh' => 'Khớp nối nhanh chuẩn Nitto 20PM']],
                ]
            ],
        ];

        $quickSpecMap = [
            'AX-WH-100'     => ['order' => 1, 'summary' => 'Chiều rộng hàm kẹp 100 mm, mở 170 mm'],
            'AX-PM-150'     => ['order' => 2, 'summary' => 'Phạm vi đo 0–150 mm, IP67 kháng nước'],
            'AX-EM-4FL-10'  => ['order' => 3, 'summary' => 'Đường kính Ø10 mm, 4 me phủ TiAlN (55 HRC)'],
            'AX-BR-6205-2RS'=> ['order' => 4, 'summary' => '25 x 52 x 15 mm, hai nắp cao su NBR'],
            'AX-CNC-VMC850' => ['order' => 5, 'summary' => 'Hành trình 800x500x550 mm, 10.000 RPM BT40'],
            'AX-LUB-EMUL20L'=> ['order' => 6, 'summary' => 'Xô 20 Lít, tỷ lệ pha 5–8% chống gỉ tốt'],
        ];

        $productGlobalIndex = 0;
        foreach ($categoriesData as $catData) {
            $products = $catData['products'];
            unset($catData['products']);

            $category = Category::updateOrCreate(
                ['slug' => $catData['slug']],
                $catData
            );

            foreach ($products as $p) {
                $img1 = '/assets/images/products/sample-' . (($productGlobalIndex % 9) + 1) . '.png';
                $img2 = '/assets/images/products/sample-' . ((($productGlobalIndex + 3) % 9) + 1) . '.png';
                $img3 = '/assets/images/products/sample-' . ((($productGlobalIndex + 6) % 9) + 1) . '.png';
                $gallery = [$img1, $img2, $img3];

                $certs = [
                    'CO/CQ Gốc Nhà Máy',
                    'ISO 9001:2015 Quản Lý Chất Lượng',
                    'Chứng Nhận Hợp Chuẩn CE Directive',
                    'Biên Bản Kiểm Định KCS AXIOM'
                ];

                $quickSpec = $quickSpecMap[$p['sku']] ?? null;

                Product::updateOrCreate(
                    ['sku' => $p['sku']],
                    [
                        'category_id' => $category->id,
                        'name' => $p['name'],
                        'slug' => Str::slug($p['name'] . '-' . $p['sku']),
                        'brand' => $p['brand'],
                        'image_url' => $img1,
                        'images' => $gallery,
                        'description' => $p['name'] . ' là thiết bị cơ khí chính xác được nhập khẩu và phân phối chính thức bởi AXIOM Industrial Supply. Sản phẩm trải qua quy trình kiểm tra chất lượng nghiêm ngặt (KCS), đạt dung sai tối ưu, có đầy đủ hồ sơ CO/CQ và hóa đơn VAT. Phù hợp cho các xưởng gia công CNC, phân xưởng cơ khí chính xác và dây chuyền lắp ráp công nghiệp.',
                        'specifications' => $p['specs'],
                        'spec_summary' => $quickSpec['summary'] ?? null,
                        'stock_status' => $p['stock'],
                        'price_display' => 'Liên hệ báo giá',
                        'has_cocq' => true,
                        'certificates' => $certs,
                        'is_featured' => $p['featured'],
                        'show_in_quick_specs' => $quickSpec !== null,
                        'quick_spec_order' => $quickSpec['order'] ?? 0,
                    ]
                );

                $productGlobalIndex++;
            }
        }
    }
}
