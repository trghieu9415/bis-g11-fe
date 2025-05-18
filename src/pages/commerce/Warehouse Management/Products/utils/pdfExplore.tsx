import html2pdf from 'html2pdf.js';
import './index.css';
export type YearReportData = {
	monthlySales: { [month: string]: number }; // Doanh thu theo tháng
	quarterlySales: { [quarter: number]: number }; // Doanh thu theo quý
	topSellingProducts: {
		id: number;
		name: string;
		quantitySold: number;
		revenue: number;
		profit: number;
	}[]; // Sản phẩm bán chạy nhất
	categorySales: {
		id: number;
		name: string;
		quantitySold: number;
		revenue: number;
		profit: number;
		percentageOfTotal: number;
	}[]; // Doanh thu theo thể loại sản phẩm
	totalRevenue: number; // Tổng doanh thu
	totalCost: number; // Tổng chi phí
	totalProfit: number; // Tổng lợi nhuận
	totalProductsSold: number; // Tổng số lượng sản phẩm bán
};

// Function to generate report HTML
export const generateReportHTML = (data: YearReportData, year: string) => {
	console.log(data.monthlySales['2025-05']);
	// Tạo tiêu đề báo cáo
	const headerHTML = `
    <div class='text-center my-2'>
      <h1 class='text-xl font-bold mb-2'>BÁO CÁO THỐNG KÊ SẢN PHẨM NĂM ${year}</h1>
    </div>
  `;

	// Thông tin tổng quan
	const overviewHTML = `
    <div class='mb-4'>
      <h2 class='text-base font-bold mb-2 text-center'>THÔNG TIN TỔNG QUAN</h2>
      <table class='w-full text-sm mb-4'>
        <tbody>
          <tr>
            <td class='py-1 w-1/2 text-right pr-4'>Tổng số sản phẩm đã bán:</td>
            <td class='py-1 w-1/2'>${data.totalProductsSold}</td>
          </tr>
          <tr>
            <td class='py-1 w-1/2 text-right pr-4'>Tổng doanh thu:</td>
            <td class='py-1 w-1/2'>${data.totalRevenue.toLocaleString()} VND</td>
          </tr>
          <tr>
            <td class='py-1 w-1/2 text-right pr-4'>Tổng chi phí:</td>
            <td class='py-1 w-1/2'>${data.totalCost.toLocaleString()} VND</td>
          </tr>
          <tr>
            <td class='py-1 w-1/2 text-right pr-4'>Tổng lợi nhuận:</td>
            <td class='py-1 w-1/2'>${data.totalProfit.toLocaleString()} VND</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

	// Thống kê theo tháng
	const monthsArray = Array.from({ length: 12 }, (_, i) => i + 1);
	const monthlySalesHTML = `
    <div class='mb-4'>
      <h2 class='text-base font-bold mb-2 text-center'>THỐNG KÊ THEO THÁNG</h2>
      <table class='w-full border border-collapse text-sm table-fixed'>
        <thead>
          <tr>
            <th class='border px-1  pb-5' style="width: 80px;">Chỉ tiêu</th>
            ${monthsArray.map(month => `<th class='border px-1  pb-5' style="width: calc((100% - 80px) / 12);">Tháng<br>${month}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class='border px-1  pb-5'>Số lượng<br>bán</td>
            ${monthsArray
							.map(month => {
								const monthKey = `${year}-${month < 10 ? '0' + month : month}`;
								console.log(`LINE 83 ${monthKey}`);
								const monthlySales = data.monthlySales[monthKey] || 0;
								console.log(`LINE 85 ${monthlySales}`);
								return `<td class='border px-1 py-1 text-center'>${monthlySales}</td>`;
							})
							.join('')}
          </tr>
        </tbody>
      </table>
    </div>
  `;

	// Thống kê theo quý
	// const quarterlySalesHTML = `
	//     <div class='mb-4'>
	//       <h2 class='text-base font-bold mb-2 text-center'>THỐNG KÊ THEO QUÝ</h2>
	//       <table class='w-full border border-collapse text-sm table-fixed'>
	//         <thead>
	//           <tr>
	//             <th class='border px-2 pb-5' style="width: 20%;">Chỉ tiêu</th>
	//             <th class='border px-2 pb-5' style="width: 20%;">Quý 1</th>
	//             <th class='border px-2 pb-5' style="width: 20%;">Quý 2</th>
	//             <th class='border px-2 pb-5' style="width: 20%;">Quý 3</th>
	//             <th class='border px-2 pb-5' style="width: 20%;">Quý 4</th>
	//           </tr>
	//         </thead>
	//         <tbody>
	//           <tr>
	//             <td class='border px-2 pb-5'>Số lượng bán</td>
	//             ${[1, 2, 3, 4]
	// 							.map(quarter => {
	// 								const quarterlySold = data.quarterlySales[quarter]
	// 									? Math.round(data.quarterlySales[quarter] / 100000)
	// 									: 0;
	// 								return `<td class='border px-2 pb-5 text-center'>${quarterlySold}</td>`;
	// 							})
	// 							.join('')}
	//           </tr>
	//         </tbody>
	//       </table>
	//     </div>
	//   `;
	const quarterlySoldCells = [1, 2, 3, 4]
		.map(quarter => {
			console.log(`LINE 127 ${data.quarterlySales[quarter]}`);
			const quarterlySold = data.quarterlySales[quarter];
			return `<td class='border px-2  pb-5 text-center align-middle '>${quarterlySold}</td>`;
		})
		.join('');

	const quarterlySalesHTML = `
  <div class='mb-4'>
    <h2 class='text-base font-bold mb-2 text-center'>THỐNG KÊ THEO QUÝ</h2>
    <table class='w-full border border-collapse text-sm table-fixed'>
      <thead>
        <tr>
          <th class='border px-2 pb-5' style="width: 20%;">Chỉ tiêu</th>
          <th class='border px-2 pb-5' style="width: 20%;">Quý 1</th>
          <th class='border px-2 pb-5' style="width: 20%;">Quý 2</th>
          <th class='border px-2 pb-5' style="width: 20%;">Quý 3</th>
          <th class='border px-2 pb-5' style="width: 20%;">Quý 4</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class='border px-2 py-1 align-middle'>Số lượng bán</td>
          ${quarterlySoldCells}
        </tr>
      </tbody>
    </table>
  </div>
`;

	// Top 10 sản phẩm bán chạy
	const topSellingHTML = `
    <div class='mb-4'>
      <h2 class='text-base font-bold mb-2 text-center'>TOP 10 SẢN PHẨM BÁN CHẠY</h2>
      <table class='w-full border border-collapse text-sm table-fixed'>
        <thead>
          <tr>
            <th class='border px-2  pb-5' style="width: 10%;">STT</th>
            <th class='border px-2  pb-5' style="width: 30%;">Tên sản phẩm</th>
            <th class='border px-2  pb-5' style="width: 15%;">Số lượng</th>
            <th class='border px-2  pb-5' style="width: 22.5%;">Doanh thu</th>
            <th class='border px-2  pb-5' style="width: 22.5%;">Lợi nhuận</th>
          </tr>
        </thead>
        <tbody>
          ${data.topSellingProducts
						.slice(0, 10)
						.map(
							(product, index) => `
            <tr>
              <td class='border px-2  pb-5  text-center'>${index + 1}</td>
              <td class='border px-2  pb-5 '>${product.name}</td>
              <td class='border px-2  pb-5  text-center'>${product.quantitySold}</td>
              <td class='border px-2  pb-5  text-right'>${product.revenue.toLocaleString()} VND</td>
              <td class='border px-2  pb-5  text-right'>${product.profit.toLocaleString()} VND</td>
            </tr>
          `
						)
						.join('')}
        </tbody>
      </table>
    </div>
  `;

	// Thống kê theo danh mục
	const categoryHTML = `
    <div class='mb-4'>
      <h2 class='text-base font-bold mb-2 text-center'>THỐNG KÊ THEO DANH MỤC</h2>
      <table class='w-full border border-collapse text-sm table-fixed'>
        <thead>
          <tr>
            <th class='border px-2  pb-5' style="width: 8%;">STT</th>
            <th class='border px-2  pb-5' style="width: 25%;">Danh mục</th>
            <th class='border px-2  pb-5' style="width: 12%;">Số lượng</th>
            <th class='border px-2  pb-5' style="width: 20%;">Doanh thu</th>
            <th class='border px-2  pb-5' style="width: 20%;">Lợi nhuận</th>
            <th class='border px-2  pb-5' style="width: 15%;">Tỷ lệ (%)</th>
          </tr>
        </thead>
        <tbody>
          ${data.categorySales
						.map(
							(category, index) => `
            <tr>
              <td class='border px-2  pb-5 text-center'>${index + 1}</td>
              <td class='border px-2  pb-5'>${category.name}</td>
              <td class='border px-2  pb-5 text-center'>${category.quantitySold}</td>
              <td class='border px-2  pb-5 text-right'>${category.revenue.toLocaleString()} VND</td>
              <td class='border px-2  pb-5 text-right'>${category.profit.toLocaleString()} VND</td>
              <td class='border px-2  pb-5 text-right'>${category.percentageOfTotal.toFixed(2)}</td>
            </tr>
          `
						)
						.join('')}
        </tbody>
      </table>
    </div>
  `;

	// Thêm footer với ngày tạo báo cáo
	const currentDate = new Date();
	const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

	const footerHTML = `
    <div class='text-right mt-6'>
      <p class='text-sm'>Báo cáo được tạo ngày: ${formattedDate}</p>
    </div>
  `;

	// Gộp toàn bộ HTML
	const fullHTML = `
    <div id="report-content" class="font-sans p-4">
      ${headerHTML}
      ${overviewHTML}
      ${monthlySalesHTML}
      ${quarterlySalesHTML}
      ${topSellingHTML}
      ${categoryHTML}
      ${footerHTML}
    </div>
  `;

	return fullHTML;
};

// Function to handle the export with preview
export const handleExportSalesReport = (data: YearReportData, year: string) => {
	// Generate the report HTML
	const reportHTML = generateReportHTML(data, year);

	// Create a modal for preview
	const modal = document.createElement('div');
	modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center';
	modal.style.overflowY = 'auto';

	// Modal content
	const modalContent = document.createElement('div');
	modalContent.className = 'bg-white rounded-lg w-11/12 max-w-5xl max-h-[90vh] overflow-auto';

	// Preview container
	const previewContainer = document.createElement('div');
	previewContainer.className = 'p-4';
	previewContainer.innerHTML = `
    <div class="flex justify-between items-center mb-4 sticky top-0 bg-white p-2 border-b">
      <h2 class="text-lg font-bold">Xem trước báo cáo</h2>
      <div class="flex gap-2">
        <button id="download-btn" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          Tải xuống PDF
        </button>
        <button id="close-preview-btn" class="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded">
          Đóng
        </button>
      </div>
    </div>
    <div id="preview-content">
      ${reportHTML}
    </div>
  `;

	modalContent.appendChild(previewContainer);
	modal.appendChild(modalContent);

	// Add to document
	document.body.appendChild(modal);

	// Handle close button
	const closeButton = document.getElementById('close-preview-btn');
	if (closeButton) {
		closeButton.addEventListener('click', () => {
			document.body.removeChild(modal);
		});
	}

	// Handle download button
	const downloadButton = document.getElementById('download-btn');
	if (downloadButton) {
		downloadButton.addEventListener('click', () => {
			// Get the preview content
			const previewContent = document.getElementById('preview-content');
			if (!previewContent) return;

			const options = {
				filename: `BaoCaoThongKeSanPham_${year}.pdf`,
				image: { type: 'jpeg', quality: 0.98 },
				html2canvas: { scale: 2 },
				jsPDF: { unit: 'mm', format: 'a3', orientation: 'l' }
			};

			// Generate and download PDF
			html2pdf()
				.from(previewContent)
				.set(options)
				.save()
				.then(() => {
					// Optional: Close the preview after download
					// document.body.removeChild(modal);
				});
		});
	}

	// Close modal when clicking outside
	modal.addEventListener('click', e => {
		if (e.target === modal) {
			document.body.removeChild(modal);
		}
	});
};

// Function to handle only preview (if needed separately)
export const previewSalesReport = (data: YearReportData, year: string) => {
	const reportHTML = generateReportHTML(data, year);

	// Create a modal for preview only
	const modal = document.createElement('div');
	modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center';
	modal.style.overflowY = 'auto';

	// Modal content
	const modalContent = document.createElement('div');
	modalContent.className = 'bg-white rounded-lg w-11/12 max-w-5xl max-h-[90vh] overflow-auto';

	// Preview container
	const previewContainer = document.createElement('div');
	previewContainer.className = 'p-4';
	previewContainer.innerHTML = `
    <div class="flex justify-between items-center mb-4 sticky top-0 bg-white p-2 border-b">
      <h2 class="text-lg font-bold">Xem trước báo cáo</h2>
      <button id="close-preview-only-btn" class="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded">
        Đóng
      </button>
    </div>
    <div id="preview-only-content">
      ${reportHTML}
    </div>
  `;

	modalContent.appendChild(previewContainer);
	modal.appendChild(modalContent);

	// Add to document
	document.body.appendChild(modal);

	// Handle close button
	const closeButton = document.getElementById('close-preview-only-btn');
	if (closeButton) {
		closeButton.addEventListener('click', () => {
			document.body.removeChild(modal);
		});
	}

	// Close modal when clicking outside
	modal.addEventListener('click', e => {
		if (e.target === modal) {
			document.body.removeChild(modal);
		}
	});
};
