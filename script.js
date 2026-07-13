/* ==========================================================================
   JAVASCRIPT INTERACTIONS FOR LÊ THỊ QUỲNH TRANG PORTFOLIO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. DOM Elements
    // ==========================================
    const navbarContainer = document.querySelector('.navbar-container');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navLinksList = document.getElementById('nav-links');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileDrawerClose = document.getElementById('mobile-drawer-close');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const backToTopBtn = document.getElementById('back-to-top');
    const scrollProgressBar = document.getElementById('scroll-progress');
    const contactForm = document.getElementById('contact-form');
    const skillProgressBars = document.querySelectorAll('.progress-bar-fill');

    // ==========================================
    // 2. Mobile Menu Navigation Toggle
    // ==========================================
    const toggleMobileMenu = () => {
        hamburgerMenu.classList.toggle('active');
        navLinksList.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    };

    const closeMobileMenu = () => {
        hamburgerMenu.classList.remove('active');
        navLinksList.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    };

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', toggleMobileMenu);
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    if (mobileDrawerClose) {
        mobileDrawerClose.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking link items
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // ==========================================
    // 2b. Liquid Nav Indicator Slider (Horizontal)
    // ==========================================
    const navIndicator = document.getElementById('nav-indicator');

    function updateNavIndicator(targetElement) {
        if (!navIndicator || !targetElement) return;

        // Don't show indicator on mobile view where links are stacked vertically
        if (window.innerWidth <= 768) {
            navIndicator.style.opacity = '0';
            return;
        }

        const width = targetElement.offsetWidth;
        const height = targetElement.offsetHeight;
        const left = targetElement.offsetLeft;
        const top = targetElement.offsetTop;

        navIndicator.style.width = `${width}px`;
        navIndicator.style.height = `${height}px`;
        navIndicator.style.left = `${left}px`;
        navIndicator.style.top = `${top}px`;
        navIndicator.style.opacity = '1';
    }

    // Set initial position
    setTimeout(() => {
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) updateNavIndicator(activeLink);
    }, 300); // short delay to ensure rendering completes

    // Recalculate position on window resize
    window.addEventListener('resize', () => {
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) {
            updateNavIndicator(activeLink);
        } else {
            navIndicator.style.opacity = '0';
        }
    });

    // Hover event listeners
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            updateNavIndicator(e.target);
        });
    });

    // When mouse leaves the whole navigation links container, return to active link
    if (navLinksList) {
        navLinksList.addEventListener('mouseleave', () => {
            const activeLink = document.querySelector('.nav-link.active');
            if (activeLink) {
                updateNavIndicator(activeLink);
            } else {
                navIndicator.style.opacity = '0';
            }
        });
    }

    // ==========================================
    // 3. Scroll Interactions (Navbar & Progress)
    // ==========================================
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        // Navbar scroll effect
        if (scrollTop > 50) {
            navbarContainer.classList.add('scrolled');
        } else {
            navbarContainer.classList.remove('scrolled');
        }

        // Progress bar width
        if (docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgressBar.style.width = `${scrollPercent}%`;
        }

        // Back to top button visibility
        if (scrollTop > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // Smooth scroll back to top when button clicked
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // 4. Scroll Reveal Animations (Intersection Observer)
    // ==========================================
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    };

    const revealObserverOption = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealObserverOption);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 5. Skill Bars Animation on Scroll
    // ==========================================
    // Store target widths from inline style, set style width to 0 first
    const barTargets = [];
    skillProgressBars.forEach((bar, idx) => {
        const targetWidth = bar.style.width || '100%';
        barTargets[idx] = targetWidth;
        bar.style.width = '0'; // reset for transition effect
    });

    const animateSkills = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate progress bars in this category card
                const barsInCard = entry.target.querySelectorAll('.progress-bar-fill');
                barsInCard.forEach(bar => {
                    // Find original index
                    const index = Array.from(skillProgressBars).indexOf(bar);
                    if (index !== -1) {
                        bar.style.width = barTargets[index];
                    }
                });
                observer.unobserve(entry.target);
            }
        });
    };

    const skillsObserver = new IntersectionObserver(animateSkills, { threshold: 0.1 });
    const skillCards = document.querySelectorAll('.skill-category-card');
    skillCards.forEach(card => skillsObserver.observe(card));

    // ==========================================
    // 6. Navigation Link Highlighting on Scroll
    // ==========================================
    const navObserverCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                        // Also update liquid indicator
                        updateNavIndicator(link);
                    }
                });
            }
        });
    };

    const navObserverOption = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies core display area
        threshold: 0
    };

    const navObserver = new IntersectionObserver(navObserverCallback, navObserverOption);
    sections.forEach(sec => navObserver.observe(sec));


    // ==========================================
    // 8. Exercise Modal Interactions & Data
    // ==========================================
    const exerciseData = {
        1: {
            tag: "Hệ điều hành",
            title: "BÀI TẬP 1: THAO TÁC QUẢN LÝ TỆP TIN VÀ THƯ MỤC TRÊN HỆ ĐIỀU HÀNH",
            goal: "Thành thạo các kỹ năng nền tảng và cơ bản nhất về quản lý hệ thống tệp tin (Files) và thư mục (Folders) trên máy tính cá nhân (sử dụng File Explorer trên Windows hoặc Finder trên macOS).",
            summary: [
                "Khởi động trình quản lý Finder/File Explorer.",
                "Điều hướng và truy cập thư mục hệ thống Documents.",
                "Khởi tạo thư mục gốc với cú pháp định danh: <code>ThucHanh_LeThiQuynhTrang</code>.",
                "Thao tác nhấp đúp để truy cập vào thư mục vừa tạo.",
                "Tạo tệp tin văn bản thuần túy <code>GhiChu.txt</code> bằng công cụ TextEdit/Notepad.",
                "Thực hiện đổi tên tệp tin (Rename) thành <code>GhiChuQuanTrong.txt</code>.",
                "Tạo thư mục con cấp hai có tên là <code>TaiLieu</code> bên trong thư mục gốc.",
                "Thực hiện kỹ thuật Sao chép và Dán (Copy & Paste) tệp tin giữa các thư mục.",
                "Tạo tệp <code>DiChuyen.txt</code> và thực hiện kỹ thuật Di chuyển (Cut & Paste) bằng các tổ hợp phím tắt hệ thống (như Cmd + C kết hợp Cmd + Option + V trên Mac).",
                "Thao tác Xóa tệp đưa vào Thùng rác (Recycle Bin / Trash).",
                "Thực hiện lệnh xóa vĩnh viễn (Sử dụng tổ hợp phím bypass thùng rác).",
                "Thực hiện mở Thùng rác và sử dụng tính năng Khôi phục (Restore / Đưa trở lại) để cứu tệp tin về vị trí cũ."
            ],
            conclusion: "Nắm vững các thao tác tệp tin và sử dụng linh hoạt hệ thống phím tắt giúp tối ưu hóa tốc độ làm việc trên máy tính.<br><br>Xây dựng được tư duy quản lý dữ liệu khoa học, ngăn nắp thông qua cấu trúc cây thư mục, giúp hạn chế rủi ro thất lạc thông tin hoặc vô tình xóa nhầm dữ liệu quan trọng trong quá trình học tập.",
            pdfUrl: "https://drive.google.com/file/d/1rCCsBRN0jgFhJcHPDUUqSk2NEqLlPAb4/view?usp=drive_link"
        },
        2: {
            tag: "Nghiên cứu",
            title: "BÀI TẬP 2: TÌM KIẾM VÀ ĐÁNH GIÁ THÔNG TIN HỌC THUẬT",
            goal: "Trình bày quy trình tìm kiếm, thu thập và đánh giá độ tin cậy của các nguồn tài liệu học thuật liên quan đến một chủ đề cụ thể (chủ đề: \"Khó khăn và chiến lược học từ vựng tiếng Hán của sinh viên Việt Nam\").<br><br>Áp dụng các tiêu chí chuẩn mực để phân loại, xếp hạng tài liệu, phục vụ cho việc xây dựng cơ sở lý luận nghiên cứu.",
            summary: [
                "Xây dựng từ khóa: Lựa chọn bộ từ khóa song ngữ Việt - Anh - Trung.",
                "Khai thác cơ sở dữ liệu: Tìm kiếm các bài báo khoa học đã qua bình duyệt (peer-reviewed) trên Google Scholar, Microsoft Academic và hệ thống thư viện số VNU LIC.",
                "Thu thập đa dạng nguồn tệp: Tổng hợp được 10 tài liệu chất lượng cao, bao gồm 05 bài báo khoa học, 02 sách chuyên khảo/luận văn và 03 báo cáo mở.",
                "Đánh giá chất lượng: Áp dụng mô hình 5 tiêu chí cốt lõi: Tác giả (Author), Cơ quan xuất bản (Publisher), Phương pháp nghiên cứu (Methodology), Trích dẫn (Citations), và Tính cập nhật (Currency) để phân loại tài liệu thành 4 mức độ tin cậy."
            ],
            conclusion: "Việc tìm kiếm và đánh giá thông tin là một kỹ năng tối quan trọng trong môi trường học thuật để thiết lập nền tảng lý luận vững chắc.<br><br>Không được tin tưởng mù quáng vào mọi nguồn thông tin trên Internet. Cần có sự cẩn trọng đối với các bài viết thiếu mô tả phương pháp nghiên cứu rõ ràng. Khi xây dựng tài liệu, bắt buộc phải sử dụng đúng định dạng trích dẫn chuẩn mực (như định dạng Harvard).",
            pdfUrl: "https://drive.google.com/file/d/1Az-gOlaju-Pa_50n9lpCuP8XduPbCTbe/view?usp=sharing"
        },
        3: {
            tag: "Kỹ năng AI",
            title: "BÀI TẬP 3: VIẾT PROMPT HIỆU QUẢ CHO CÁC TÁC VỤ HỌC TẬP",
            goal: "Thực nghiệm và so sánh hiệu quả đầu ra của 3 cấp độ câu lệnh (Prompt cơ bản, Prompt cải tiến, Prompt nâng cao) với các tác vụ khác nhau: tóm tắt bài đọc, giải thích khái niệm phức tạp, và tạo bộ câu hỏi ôn tập.<br><br>Phân tích cơ chế vận hành của Mô hình ngôn ngữ lớn (LLM) để đúc kết nguyên tắc viết prompt hiệu quả.",
            summary: [
                "Thực hiện Tác vụ 1 (Tóm tắt): Chạy prompt cơ bản để tóm tắt bài viết về Generative AI, sau đó nâng cấp bằng prompt giới hạn số từ/bố cục, và cuối cùng dùng prompt nâng cao đóng vai nhà khoa học MIT để xuất dữ liệu dạng bảng.",
                "Thực hiện Tác vụ 2 (Giải thích khái niệm): Thử nghiệm giải thích khái niệm \"Mạng nơ-ron nhân tạo\" (ANN) bằng các phép ẩn dụ thực tế (hệ thống phân loại thư, cuộc thi nếm món ăn) cho học sinh hoặc theo phong cách sư phạm giản dị của Richard Feynman.",
                "Thực hiện Tác vụ 3 (Tạo đề thi): Tạo bộ 5 câu hỏi ôn tập từ cơ bản đến nâng cao theo Thang đo tư duy Bloom, sử dụng khối mã (Code block) để giấu đáp án.",
                "Đánh giá đối sánh: Lập bảng so sánh 3 phiên bản prompt dựa trên tiêu chí: Độ chính xác, Bố cục/Định dạng, và Độ sâu kiến thức.",
                "Rút ra công thức thiết kế prompt chuẩn CLEAR: Context (Bối cảnh) - Limit (Giới hạn) - Execute by Steps (Thực thi theo bước) - Anchor Examples (Ví dụ neo giữ) - Reform & Iterate (Tái cấu trúc và lặp lại).",
                "Đúc kết sản phẩm: Đưa ra 3 rủi ro đạo đức lớn (gian lận, đạo văn kiểu mới, giảm kỹ năng tự học/lộ dữ liệu), thiết lập hệ thống \"7 nguyên tắc vàng\" cá nhân và mô phỏng hóa dưới dạng một Infographic truyền thông."
            ],
            conclusion: "AI chỉ nên đóng vai trò là một \"trợ lý học tập\" hay một \"người gia sư\" để phản biện, gợi ý ý tưởng chứ tuyệt đối không được trở thành \"người làm thay\".<br><br>Sinh viên là người phải chịu trách nhiệm cuối cùng cho mọi sản phẩm học thuật của mình. Phải luôn cảnh giác trước hiện tượng AI \"bịa đặt\" thông tin hoặc sinh nguồn giả.",
            pdfUrl: "https://drive.google.com/file/d/1gm6OEdwHcqXo7xrJf5nGS-t7fztvvxZ6/view?usp=sharing"
        },
        4: {
            tag: "Cộng tác",
            title: "BÀI TẬP 4: ỨNG DỤNG CÔNG CỤ SỐ TRONG QUẢN LÝ DỰ ÁN VÀ CỘNG TÁC NHÓM",
            goal: "Tiếp cận, trải nghiệm và đánh giá hiệu quả thực tế của các công cụ số phổ biến phục vụ cho quá trình làm việc nhóm, quản lý công việc và lưu trữ dữ liệu học tập.<br><br>Nhận diện các thách thức nảy sinh trong quá trình hợp tác trực tuyến và đề xuất các giải pháp khắc phục.",
            summary: [
                "Trello (Quản lý dự án): Sử dụng các bảng (Board), danh sách trạng thái (\"Cần thực hiện\", \"Đang thực hiện\", \"Hoàn thành\") và các thẻ nhiệm vụ (Cards) để theo dõi tiến độ một cách trực quan, phân chia thời hạn công việc cụ thể.",
                "Google Docs (Soạn thảo văn bản): Triển khai viết nội dung báo cáo đồng thời theo thời gian thực (real-time), tận dụng tính năng Nhận xét (Comment) và Gợi ý (Suggesting) để rà soát lỗi.",
                "Microsoft OneDrive / Google Drive (Lưu trữ dữ liệu): Thiết lập không gian lưu trữ tài liệu tập trung trên điện toán đám mây, phân quyền truy cập (Manage Access) và quy chuẩn hóa cách đặt tên tệp để tránh nhầm lẫn các phiên bản.",
                "Zalo (Giao tiếp nhóm): Sử dụng chat nhóm, gọi thoại/video và tính năng ghim thông báo để tương tác nhanh, xử lý các tình huống khẩn cấp."
            ],
            conclusion: "Các công cụ số giúp nâng cao đáng kể năng suất cá nhân và tối ưu hóa quy trình phối hợp nhóm, giảm thời gian trao đổi thừa.<br><br>Để làm việc nhóm trực tuyến hiệu quả, việc ứng dụng công cụ thôi là chưa đủ; nhóm cần phải thiết lập các quy tắc chung ngay từ đầu như: thống nhất quy chuẩn định dạng văn bản, quy tắc đặt tên file rõ ràng, và có cơ chế giám sát/nhắc nhở tiến độ liên tục để tránh tình trạng \"lệch pha\" giữa các thành viên.",
            pdfUrl: "https://drive.google.com/file/d/1V6ylGEni2shHYr33I9Pde5poznh7jwwe/view?usp=sharing"
        },
        5: {
            tag: "AI Tạo Sinh",
            title: "BÀI TẬP 5: ỨNG DỤNG HỆ SINH THÁI AI TẠO SINH TRONG SÁNG TẠO NỘI DUNG (SẢN PHẨM INFOGRAPHIC)",
            goal: "Ứng dụng phối hợp toàn diện các nhóm công cụ AI tạo sinh (văn bản, hình ảnh, thiết kế) để hoàn thiện một sản phẩm truyền thông số hoàn chỉnh với chủ đề: \"Tác động của trí tuệ nhân tạo (AI) đến sinh viên\".<br><br>Trải nghiệm thực tế để thực hiện đánh giá, so sánh ưu - nhược điểm của các công cụ AI khác nhau.",
            summary: [
                "Sáng tạo nội dung văn bản: Sử dụng prompt yêu cầu lên ý tưởng cho infographic. So sánh ChatGPT (ưu điểm trực quan, bố cục rõ ràng, nắm ý nhanh nhưng ít chi tiết sâu) đối chiếu với Google Gemini (ưu điểm nội dung đầy đủ, phân tích sâu, logic tốt nhưng bị dài dòng). Tự tổng hợp thành 5 thông điệp cốt lõi.",
                "Sáng tạo hình ảnh minh họa: Sử dụng prompt tiếng Anh dạng phong cách \"modern flat design\". So sánh DALL-E (dễ dùng, ảnh đẹp nhanh, style sẵn có tốt nhưng khó kiểm soát chi tiết nhỏ) đối chiếu với Stable Diffusion (tùy chỉnh model linh hoạt, kiểm soát chi tiết tốt hơn nhưng ảnh ít khi \"đẹp sẵn\", đòi hỏi kỹ năng viết prompt kỹ).",
                "Thiết kế đồ họa: Nạp toàn bộ văn bản và hình ảnh vào Canva AI để tự động xuất ra bố cục poster. Người học tiến hành tự tay chỉnh sửa thủ công để hoàn thiện sản phẩm Infographic cuối cùng do Canva AI không tự động áp dụng hình ảnh đã tạo trước đó."
            ],
            conclusion: "AI tạo sinh có khả năng đẩy nhanh tiến độ công việc, kích thích ý tưởng thiết kế vô cùng mạnh mẽ.<br><br>Tuy nhiên, các công cụ AI vẫn tồn tại các hạn chế lớn như dễ sai lệch thông tin, phụ thuộc nhiều vào chất lượng câu lệnh và thiếu đi độ sâu sáng tạo. Người học không được sao chép hoàn toàn mà bắt buộc phải có sự kiểm tra, can thiệp cá nhân và chỉnh sửa thủ công để sản phẩm đạt chất lượng thực tế và đảm bảo đạo đức học thuật.",
            pdfUrl: "https://drive.google.com/file/d/1UnpLBpeNDYLIwAg4vXwt0UULtYS-a55D/view?usp=sharing"
        },
        6: {
            tag: "Liêm chính",
            title: "BÀI TẬP 6: NGHIÊN CỨU LIÊM CHÍNH HỌC THUẬT VÀ SỬ DỤNG AI CÓ TRÁCH NHIỆM",
            goal: "Phân tích các chính sách liêm chính học thuật và quy định chống đạo văn của các trường đại học tại Việt Nam (ULIS) dưới lăng kính ứng dụng AI.<br><br>Xây dựng bộ quy tắc ứng xử cá nhân và sơ đồ quy trình làm bài minh bạch, có trách nhiệm khi có sự đồng hành của công cụ trí tuệ nhân tạo tạo sinh.",
            summary: [
                "Phân tích chính sách: Đọc hiểu văn bản quy định của nhà trường, làm rõ ranh giới giữa \"hỗ trợ học tập\" và \"gian lận\", hiểu rõ chế tài phạt trừ điểm khi bài làm có mức độ trùng lặp cao.",
                "Xây dựng quy trình làm bài 6 bước: Từ xác định nhiệm vụ, thiết kế prompt ràng buộc, lưu nhật ký đầu ra AI, kiểm chứng nguồn, chỉnh sửa/viết lại bằng lời cá nhân đến công khai mức độ dùng AI (AI disclosure).",
                "Thực hành lập Nhật ký Prompt (Prompt log): Ghi chép chi tiết từng lần tương tác với AI, đánh giá chất lượng và cách thức tích hợp/sửa đổi nội dung vào bài báo cáo.",
                "Đúc kết sản phẩm: Đưa ra 3 rủi ro đạo đức lớn (gian lận, đạo văn kiểu mới, giảm kỹ năng tự học/lộ dữ liệu), thiết lập hệ thống \"7 nguyên tắc vàng\" cá nhân và mô phỏng hóa dưới dạng một Infographic truyền thông."
            ],
            conclusion: "AI chỉ nên đóng vai trò là một \"trợ lý học tập\" hay một \"người gia sư\" để phản biện, gợi ý ý tưởng chứ tuyệt đối không được trở thành \"người làm thay\".<br><br>Sinh viên là người phải chịu trách nhiệm cuối cùng cho mọi sản phẩm học thuật của mình. Phải luôn cảnh giác trước hiện tượng AI \"bịa đặt\" thông tin hoặc sinh nguồn giả.",
            pdfUrl: "https://drive.google.com/file/d/1aM6ClldDgNxXvodjAMl_rVjheDMrUZxg/view?usp=sharing"
        }
    };

    // Modal DOM Elements
    const exerciseModal = document.getElementById('exercise-modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalTag = document.getElementById('modal-exercise-tag');
    const modalTitle = document.getElementById('modal-exercise-title');
    const modalGoal = document.getElementById('modal-exercise-goal');
    const modalSummary = document.getElementById('modal-exercise-summary');
    const modalConclusion = document.getElementById('modal-exercise-conclusion');
    const modalDownloadPdf = document.getElementById('modal-download-pdf');

    // View detail buttons click listener
    const viewDetailBtns = document.querySelectorAll('.btn-view-detail');
    viewDetailBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const exerciseId = btn.getAttribute('data-id');
            const data = exerciseData[exerciseId];
            if (!data) return;

            // Populate Modal Content
            modalTag.textContent = data.tag;
            modalTitle.textContent = data.title;
            modalGoal.innerHTML = data.goal;
            modalConclusion.innerHTML = data.conclusion;
            modalDownloadPdf.setAttribute('href', data.pdfUrl);

            // Populate Summary Steps List
            modalSummary.innerHTML = '';
            data.summary.forEach(step => {
                const li = document.createElement('li');
                li.innerHTML = step;
                modalSummary.appendChild(li);
            });

            // Show Modal with animation
            exerciseModal.classList.add('active');
            document.body.classList.add('no-scroll');
        });
    });

    // Close Modal function
    const closeModal = () => {
        if (exerciseModal) {
            exerciseModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    };

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking overlay
    if (exerciseModal) {
        exerciseModal.addEventListener('click', (e) => {
            if (e.target === exerciseModal) {
                closeModal();
            }
        });
    }

    // Close modal with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && exerciseModal && exerciseModal.classList.contains('active')) {
            closeModal();
        }
    });

});
