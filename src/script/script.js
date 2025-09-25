class BookDestroyerApp {
    constructor() {
        this.currentTheme = "dark";
        this.currentPage = "home";
        this.sidebarOpen = false;
        this.isMobile = window.innerWidth <= 1024;

        this.init();
    }

    init() {
        this.initializeTheme();
        this.initializeEventListeners();
        this.initializeAnimations();
        this.handleResize();
        this.initializeMainApp();
        
    }

    initializeMainApp() {
        this.initializeSidebar();
        this.initializeTabs();
        this.initializeCounters();
        this.initializeScrollEffects();
        this.initializeSearch();
        this.initializeAuth();
        this.loadApostilasData();
        this.initializeDonationModal();
    }

    // Theme Management
    initializeTheme() {
        const savedTheme = localStorage.getItem("theme") || "dark";
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.body.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);

        const themeIcon = document.querySelector("#themeToggle i");
        if (themeIcon) {
            themeIcon.className =
                theme === "dark" ? "fas fa-sun" : "fas fa-moon";
        }

        // Adiciona animação suave na mudança de tema
        document.body.style.transition =
            "background-color 0.3s ease, color 0.3s ease";
        setTimeout(() => {
            document.body.style.transition = "";
        }, 300);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === "dark" ? "light" : "dark";
        this.setTheme(newTheme);

        // Adiciona efeito visual na troca de tema
        const themeBtn = document.getElementById("themeToggle");
        themeBtn.classList.add("theme-switching");
        setTimeout(() => {
            themeBtn.classList.remove("theme-switching");
        }, 300);
    }

    // Sidebar Management
    initializeSidebar() {
        this.updateSidebarState();
        this.initializeSidebarNavigation();
    }

    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
        this.updateSidebarState();
    }

    updateSidebarState() {
        const sidebar = document.getElementById("sidebar");
        const mainContent = document.getElementById("mainContent");
        const overlay = document.getElementById("overlay");

        if (this.isMobile) {
            // Mobile logic
            if (this.sidebarOpen) {
                sidebar.classList.add("open");
                sidebar.classList.remove("collapsed");
                overlay.classList.add("active");
                document.body.classList.add("sidebar-open");
            } else {
                sidebar.classList.remove("open");
                sidebar.classList.remove("collapsed");
                overlay.classList.remove("active");
                document.body.classList.remove("sidebar-open");
            }
            // Always collapsed on mobile when closed
            mainContent.classList.add("sidebar-collapsed");
        } else {
            if (this.sidebarOpen) {
                sidebar.classList.remove("collapsed");
                mainContent.classList.remove("sidebar-collapsed");
            } else {
                sidebar.classList.add("collapsed");
                mainContent.classList.add("sidebar-collapsed");
            }
        }
    }

    initializeSidebarNavigation() {
        const sidebarLinks = document.querySelectorAll(".sidebar-link");

        sidebarLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();

                const page = link.getAttribute("data-page");
                if (page) {
                    this.navigateToPage(page);

                    // Update active state
                    document
                        .querySelectorAll(".sidebar-item")
                        .forEach((item) => {
                            item.classList.remove("active");
                        });
                    link.closest(".sidebar-item").classList.add("active");

                    // Close sidebar on mobile
                    if (this.isMobile) {
                        this.sidebarOpen = false;
                        this.updateSidebarState();
                    }
                }
            });
        });
    }

    // Page Navigation
    navigateToPage(page) {
        // Hide all pages
        document.querySelectorAll(".page").forEach((p) => {
            p.classList.remove("active");
            p.classList.add("fade-out");
        });

        // Show target page with animation
        setTimeout(() => {
            document.querySelectorAll(".page").forEach((p) => {
                p.classList.remove("fade-out");
            });

            const targetPage = document.getElementById(`${page}Page`);
            if (targetPage) {
                targetPage.classList.add("active");
                this.currentPage = page;

                // Reinitialize animations for the new page
                this.initializePageAnimations(targetPage);
            }
        }, 150);
    }

    initializePageAnimations(page) {
        // Animate cards and elements when page loads
        const cards = page.querySelectorAll(
            ".feature-card, .grade-card, .stat-card",
        );
        cards.forEach((card, index) => {
            card.style.opacity = "0";
            card.style.transform = "translateY(30px)";

            setTimeout(() => {
                card.style.transition =
                    "opacity 0.6s ease, transform 0.6s ease";
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            }, index * 100);
        });
    }

    // Tab Management
    initializeTabs() {
        const tabButtons = document.querySelectorAll(".tab-btn");
        const tabContents = document.querySelectorAll(".tab-content");

        tabButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const targetTab = button.getAttribute("data-tab");

                // Remove active class from all tabs and contents
                tabButtons.forEach((btn) => btn.classList.remove("active"));
                tabContents.forEach((content) => {
                    content.classList.remove("active");
                    content.style.opacity = "0";
                });

                // Add active class to clicked tab
                button.classList.add("active");

                // Show target content with animation
                setTimeout(() => {
                    const targetContent = document.getElementById(targetTab);
                    if (targetContent) {
                        targetContent.classList.add("active");
                        targetContent.style.transition = "opacity 0.3s ease";
                        targetContent.style.opacity = "1";
                    }
                }, 150);
            });
        });
    }

    // Counter Animation
    initializeCounters() {
        const counters = document.querySelectorAll(".stat-number[data-target]");

        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute("data-target"));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = this.formatNumber(
                        Math.floor(current),
                    );
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = this.formatNumber(target);
                }
            };

            updateCounter();
        };

        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (
                        entry.isIntersecting &&
                        !entry.target.classList.contains("animated")
                    ) {
                        entry.target.classList.add("animated");
                        animateCounter(entry.target);
                    }
                });
            },
            { threshold: 0.5 },
        );

        counters.forEach((counter) => {
            counterObserver.observe(counter);
        });
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + "M";
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + "k";
        }
        return num.toString();
    }

    // Search Functionality
    initializeSearch() {
        const searchInput = document.querySelector(".search-input");

        if (searchInput) {
            let searchTimeout;

            searchInput.addEventListener("input", (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();

                if (query.length >= 2) {
                    searchTimeout = setTimeout(() => {
                        this.performSearch(query);
                    }, 300);
                } else {
                    this.clearSearchResults();
                }
            });
        }
    }

    performSearch(query) {
        console.log("Searching for:", query);
        // Implementar busca real aqui
        this.showSearchResults(query);
    }

    showSearchResults(query) {
        // Implementar resultados de busca
        console.log("Showing search results for:", query);
    }

    clearSearchResults() {
        // Limpar resultados de busca
        console.log("Clearing search results");
    }

    // Scroll Effects
    initializeScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate-in");
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            ".feature-card, .grade-card, .stat-card",
        );
        animatedElements.forEach((el) => {
            observer.observe(el);
        });
    }

    // Animations
    initializeAnimations() {
        // Add entrance animations to key elements
        const heroElements = document.querySelectorAll(
            ".hero-badge, .hero-title, .hero-subtitle, .hero-actions",
        );
        heroElements.forEach((el, index) => {
            el.style.opacity = "0";
            el.style.transform = "translateY(30px)";

            setTimeout(() => {
                el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
            }, index * 200);
        });
    }

    // Event Listeners
    initializeEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById("themeToggle");
        if (themeToggle) {
            themeToggle.addEventListener("click", () => {
                this.toggleTheme();
            });
        }

        // Sidebar toggle
        const sidebarToggle = document.getElementById("sidebarToggle");
        if (sidebarToggle) {
            sidebarToggle.addEventListener("click", () => {
                this.toggleSidebar();
            });
        }

        // Overlay click (mobile)
        const overlay = document.getElementById("overlay");
        if (overlay) {
            overlay.addEventListener("click", () => {
                this.sidebarOpen = false;
                this.updateSidebarState();
            });
        }

        // Page navigation buttons
        document.addEventListener("click", (e) => {
            if (
                e.target.matches("[data-page]") ||
                e.target.closest("[data-page]")
            ) {
                e.preventDefault();
                const target = e.target.matches("[data-page]")
                    ? e.target
                    : e.target.closest("[data-page]");
                const page = target.getAttribute("data-page");
                this.navigateToPage(page);
            }
        });

        // Button animations
        this.initializeButtonAnimations();

        // Window resize
        window.addEventListener("resize", () => {
            this.handleResize();
        });
    }

    initializeButtonAnimations() {
        const buttons = document.querySelectorAll(
            ".btn, .theme-toggle, .sidebar-toggle",
        );

        buttons.forEach((button) => {
            button.addEventListener("mouseenter", function() {
                this.style.transform = "translateY(-2px)";
            });

            button.addEventListener("mouseleave", function() {
                this.style.transform = "translateY(0)";
            });

            button.addEventListener("click", function(e) {
                // Ripple effect
                const ripple = document.createElement("span");
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                  position: absolute;
                  width: ${size}px;
                  height: ${size}px;
                  left: ${x}px;
                  top: ${y}px;
                  background: rgba(255, 255, 255, 0.3);
                  border-radius: 50%;
                  transform: scale(0);
                  animation: ripple 0.6s linear;
                  pointer-events: none;
              `;

                this.style.position = "relative";
                this.style.overflow = "hidden";
                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 1024;

        if (wasMobile !== this.isMobile) {
            this.sidebarOpen = !this.isMobile;
            this.updateSidebarState();
        }
    }

    // Authentication System
    initializeAuth() {
        this.initializeLogin();
        this.initializeDashboard();
        this.checkAuthState();
    }

    initializeLogin() {
        const loginForm = document.getElementById("loginForm");
        const passwordToggle = document.getElementById("passwordToggle");
        const passwordInput = document.getElementById("senha");

        if (passwordToggle && passwordInput) {
            passwordToggle.addEventListener("click", () => {
                const type =
                    passwordInput.getAttribute("type") === "password"
                        ? "text"
                        : "password";
                passwordInput.setAttribute("type", type);
                passwordToggle.querySelector("i").className =
                    type === "password" ? "fas fa-eye" : "fas fa-eye-slash";
            });
        }

        if (loginForm) {
            loginForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                await this.handleLogin();
            });
        }
    }

    initializeDashboard() {
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                this.handleLogout();
            });
        }
    }

    async handleLogin() {
        const raInput = document.getElementById("ra");
        const senhaInput = document.getElementById("senha");
        const loginBtn = document.querySelector(".login-btn");

        // Validação dos campos
        if (!raInput.value.trim() || !senhaInput.value.trim()) {
            this.showToast("Por favor, preencha todos os campos!", "error");
            return;
        }

        // Validação básica do RA (deve ter pelo menos 8 dígitos)
        if (raInput.value.trim().length < 8) {
            this.showToast("RA deve conter pelo menos 8 dígitos!", "error");
            return;
        }

        loginBtn.classList.add("loading");

        try {
            const userData = await this.authenticateUser(
                raInput.value.trim(),
                senhaInput.value,
            );

            if (userData) {
                // Salvar dados do usuário
                localStorage.setItem("userData", JSON.stringify(userData));
                localStorage.setItem("isLoggedIn", "true");

                // Processar nome do usuário
                const fullUserName = userData?.name;
                let firstName = "";
                if (fullUserName && typeof fullUserName === "string") {
                    const nameParts = fullUserName.trim().split(" ");
                    firstName = nameParts[0] || "";
                    if (firstName) {
                        firstName =
                            firstName.charAt(0).toUpperCase() +
                            firstName.slice(1).toLowerCase();
                    }
                }

                // Navegar para dashboard
                this.navigateToPage("dashboard");
                this.populateDashboard(userData);

                // Mostrar toast de boas-vindas
                if (firstName) {
                    setTimeout(() => {
                        this.showToast(
                            `Seja bem-vindo(a), ${firstName}!`,
                            "success",
                        );
                    }, 250);
                } else {
                    setTimeout(() => {
                        this.showToast(
                            "Login realizado com sucesso!",
                            "success",
                        );
                    }, 250);
                }
            }
        } catch (error) {
            console.error("Erro no login:", error);
            if (
                error.message.includes("401") ||
                error.message.includes("Login failed")
            ) {
                this.showToast("Credenciais incorretas!", "error");
            } else if (error.message.includes("Token not received")) {
                this.showToast("Erro no servidor. Tente novamente.", "error");
            } else {
                this.showToast(
                    "Erro de conexão. Verifique sua internet.",
                    "error",
                );
            }
        } finally {
            loginBtn.classList.remove("loading");
        }
    }

    async authenticateUser(ra, senha) {
        const loginData = {
            user: ra,
            senha: senha,
        };

        const headers = {
            Accept: "application/json",
            "Ocp-Apim-Subscription-Key": "2b03c1db3884488795f79c37c069381a",
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        };

        try {
            const loginResponse = await this.makeRequest(
                "https://sedintegracoes.educacao.sp.gov.br/credenciais/api/LoginCompletoToken",
                "POST",
                headers,
                loginData,
            );

            if (!loginResponse.token) {
                throw new Error("Token not received");
            }

            const userDataResponse = await this.makeRequest(
                "https://edusp-api.ip.tv/registration/edusp/token",
                "POST",
                this.getDefaultHeaders(),
                { token: loginResponse.token },
            );

            if (!userDataResponse.auth_token) {
                throw new Error("Auth token not received");
            }

            const userInfoResponse = await this.makeRequest(
                "https://edusp-api.ip.tv/room/user?list_all=true&with_cards=true",
                "GET",
                {
                    ...this.getDefaultHeaders(),
                    "x-api-key": userDataResponse.auth_token,
                },
            );

            const freqResponse = await fetch(
                `https://sedintegracoes.educacao.sp.gov.br/apiboletim/api/Frequencia/GetAlunoQuantidadeSemFalta?codigoAluno=${loginResponse.DadosUsuario?.CD_USUARIO}&anoLetivo=2025`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Ocp-Apim-Subscription-Key":
                            "a84380a41b144e0fa3d86cbc25027fe6",
                        Origin: "https://saladofuturo.educacao.sp.gov.br/",
                        Referer: "https://saladofuturo.educacao.sp.gov.br/",
                    },
                },
            )
                .then((res) => res.json())
                .catch(() => ({}));

            const fullName =
                userDataResponse.name ||
                loginResponse.name ||
                userInfoResponse.name ||
                "Estudante";

            const schoolName =
                userInfoResponse?.rooms?.[0]?.meta?.nome_escola ||
                "Escola não identificada";

            const userData = {
                name: fullName,
                ra: ra,
                email:
                    loginResponse.DadosUsuario?.EMAIL ||
                    userDataResponse.EMAIL ||
                    loginResponse.email ||
                    userInfoResponse.email ||
                    "Email não disponível",
                school: schoolName,
                token: loginResponse.token,
                cdaluno: loginResponse.DadosUsuario?.CD_USUARIO,
                auth_token: userDataResponse.auth_token,
                freqUsuario: String(freqResponse.aulasSemFalta ?? "0"),
            };

            return userData;
        } catch (error) {
            throw error;
        }
    }

    getDefaultHeaders() {
        return {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-api-realm": "edusp",
            "x-api-platform": "webclient",
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            Connection: "keep-alive",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
        };
    }

    async makeRequest(url, method = "GET", headers = {}, body = null) {
        const options = {
            method,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
                "Content-Type": "application/json",
                ...headers,
            },
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP ${method} ${url} => ${response.status}`);
        }
        return response.json();
    }

    populateDashboard(userData) {
        const userNameEl = document.getElementById("userName");
        const fullNameEl = document.getElementById("fullName");
        const studentRAEl = document.getElementById("studentRA");
        const schoolNameEl = document.getElementById("schoolName");
        const schoolInfoEl = document.getElementById("schoolInfo");
        const schoolToggle = document.getElementById("schoolToggle");
        const faltasStat = document.getElementById("faltas");

        if (userNameEl && userData.name) {
            // Processar nome completo para exibir apenas o primeiro nome formatado
            const fullUserName = userData.name.trim();
            let firstName = "";

            if (fullUserName && typeof fullUserName === "string") {
                const nameParts = fullUserName.split(" ");
                firstName = nameParts[0] || "";
                if (firstName) {
                    firstName =
                        firstName.charAt(0).toUpperCase() +
                        firstName.slice(1).toLowerCase();
                }
            }

            userNameEl.textContent = firstName || "Estudante";
        }

        // Configurar informações da escola
        if (schoolInfoEl && userData.school) {
            schoolInfoEl.textContent = userData.school;
            schoolInfoEl.setAttribute("data-school", userData.school);
        }

        if (schoolToggle) {
            let schoolVisible = true;

            schoolToggle.addEventListener("click", () => {
                const schoolSpan = document.getElementById("schoolInfo");
                const icon = schoolToggle.querySelector("i");

                if (schoolVisible) {
                    schoolSpan.textContent = "••••••••••••••••";
                    icon.className = "fas fa-eye-slash";
                    schoolVisible = false;
                } else {
                    schoolSpan.textContent =
                        schoolSpan.getAttribute("data-school");
                    icon.className = "fas fa-eye";
                    schoolVisible = true;
                }
            });
        }

        if (fullNameEl) fullNameEl.textContent = userData.name || "-";
        if (studentRAEl) studentRAEl.textContent = userData.ra || "-";
        if (schoolNameEl) schoolNameEl.textContent = userData.email || "-";
        if (faltasStat) faltasStat.textContent = userData.freqUsuario || "-";

        // Animar cards do dashboard
        setTimeout(() => {
            const dashboardCards = document.querySelectorAll(".dashboard-card");
            dashboardCards.forEach((card, index) => {
                card.style.opacity = "0";
                card.style.transform = "translateY(30px)";

                setTimeout(() => {
                    card.style.transition =
                        "opacity 0.6s ease, transform 0.6s ease";
                    card.style.opacity = "1";
                    card.style.transform = "translateY(0)";
                }, index * 150);
            });
        }, 100);
    }

    handleLogout() {
        localStorage.removeItem("userData");
        localStorage.removeItem("isLoggedIn");

        // Limpar campos do formulário
        const raInput = document.getElementById("ra");
        const senhaInput = document.getElementById("senha");
        if (raInput) raInput.value = "";
        if (senhaInput) senhaInput.value = "";

        // Navegar para página de login
        this.navigateToPage("minhas-informacoes");
        this.showToast("Logout realizado com sucesso!", "success");
    }

    checkAuthState() {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        const userData = localStorage.getItem("userData");

        if (isLoggedIn === "true" && userData) {
            try {
                const parsedUserData = JSON.parse(userData);
                // Se está logado e acessando a página de informações, redirecionar para dashboard
                if (this.currentPage === "minhas-informacoes") {
                    this.navigateToPage("dashboard");
                    this.populateDashboard(parsedUserData);
                }
            } catch (error) {
                // Se houver erro ao parsear, fazer logout
                this.handleLogout();
            }
        }
    }

    // API Data Loading
    async loadApostilasData() {
        try {
            this.showLoadingState();
            const response = await fetch('https://books-api-blush.vercel.app/api/apostilas');

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            this.renderApostilasData(data);
            this.hideLoadingState();
        } catch (error) {
            console.error('Erro ao carregar apostilas:', error);
            this.hideLoadingState();
            this.showToast('Erro ao carregar apostilas. Tente novamente.', 'error');
        }
    }

    showLoadingState() {
        const ensino1Container = document.getElementById('ensino-fundamental');
        const ensino2Container = document.getElementById('ensino-medio');

        const loadingHTML = `
          <div class="loading-container">
              <div class="loading-spinner"></div>
              <p class="loading-text">Carregando apostilas...</p>
          </div>
      `;

        if (ensino1Container) ensino1Container.innerHTML = loadingHTML;
        if (ensino2Container) ensino2Container.innerHTML = loadingHTML;
    }

    hideLoadingState() {
        // O loading será removido quando renderizarmos o conteúdo
    }

    renderApostilasData(data) {
        this.renderEnsinoFundamental(data);
        this.renderEnsinoMedio(data);
    }

    renderEnsinoFundamental(data) {
        const container = document.getElementById('ensino-fundamental');
        if (!container) return;

        const gradeKeys = ['6ano', '7ano', '8ano', '9ano'];
        const gradeCards = gradeKeys.map(key => {
            if (!data[key]) return '';

            const grade = data[key];
            const volumes = Object.keys(grade.volumes).map(volumeKey => {
                const volume = grade.volumes[volumeKey];
                const books = volume.books.map(book => `
                  <a href="${book.url}" target="_blank" class="book-item">
                      <i class="fas fa-file-pdf"></i>
                      <span>${book.title}</span>
                      <i class="fas fa-external-link-alt"></i>
                  </a>
              `).join('');

                return `
                  <div class="volume-section">
                      <h4 class="volume-title">${volume.title}</h4>
                      <div class="books-list">
                          ${books}
                      </div>
                  </div>
              `;
            }).join('');

            return `
              <div class="grade-card">
                  <div class="grade-header">
                      <div class="grade-icon">
                          <i class="fas fa-graduation-cap"></i>
                      </div>
                      <h3>${grade.title}</h3>
                      <span class="grade-count">${grade.totalApostilas} apostilas</span>
                  </div>
                  ${volumes}
              </div>
          `;
        }).join('');

        container.innerHTML = `<div class="grade-cards">${gradeCards}</div>`;
    }

    renderEnsinoMedio(data) {
        const container = document.getElementById('ensino-medio');
        if (!container) return;

        const gradeKeys = ['1ano', '2ano', '3ano'];
        const gradeCards = gradeKeys.map(key => {
            if (!data[key]) return '';

            const grade = data[key];
            const volumes = Object.keys(grade.volumes).map(volumeKey => {
                const volume = grade.volumes[volumeKey];
                const books = volume.books.map(book => `
                  <a href="${book.url}" target="_blank" class="book-item">
                      <i class="fas fa-file-pdf"></i>
                      <span>${book.title}</span>
                      <i class="fas fa-external-link-alt"></i>
                  </a>
              `).join('');

                return `
                  <div class="volume-section">
                      <h4 class="volume-title">${volume.title}</h4>
                      <div class="books-list">
                          ${books}
                      </div>
                  </div>
              `;
            }).join('');

            return `
              <div class="grade-card">
                  <div class="grade-header">
                      <div class="grade-icon">
                          <i class="fas fa-graduation-cap"></i>
                      </div>
                      <h3>${grade.title}</h3>
                      <span class="grade-count">${grade.totalApostilas} apostilas</span>
                  </div>
                  ${volumes}
              </div>
          `;
        }).join('');

        container.innerHTML = `<div class="grade-cards">${gradeCards}</div>`;
    }

    

    // Modal de Doação
    initializeDonationModal() {
        const modal = document.getElementById('donationModal');
        const closeBtn = document.getElementById('closeDonationModal');
        
        if (!modal || !closeBtn) return;

        // Mostrar modal após 2 segundos se não foi fechado antes
        const modalShown = localStorage.getItem('donationModalShown');
        const lastShown = localStorage.getItem('donationModalLastShown');
        const now = new Date().getTime();
        const oneDayInMs = 24 * 60 * 60 * 1000; // 24 horas

        // Mostrar modal se nunca foi mostrado ou se passou mais de 24 horas
        if (!modalShown || !lastShown || (now - parseInt(lastShown)) > oneDayInMs) {
            setTimeout(() => {
                this.showDonationModal();
            }, 3000); // 3 segundos após carregar a página
        }

        // Fechar modal
        closeBtn.addEventListener('click', () => {
            this.closeDonationModal();
        });

        // Fechar modal clicando fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeDonationModal();
            }
        });

        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeDonationModal();
            }
        });
    }

    showDonationModal() {
        const modal = document.getElementById('donationModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeDonationModal() {
        const modal = document.getElementById('donationModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Marcar como mostrado e salvar timestamp
            localStorage.setItem('donationModalShown', 'true');
            localStorage.setItem('donationModalLastShown', new Date().getTime().toString());
        }
    }

    // Toast notifications
    showToast(message, type = "info") {
        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
          <i class="fas fa-${type === "success" ? "check" : type === "error" ? "times" : "info"}"></i>
          <span>${message}</span>
      `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("show");
        }, 100);

        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new BookDestroyerApp();
});

// Add CSS animations for ripple effect
if (!document.querySelector("#dynamic-styles")) {
    const style = document.createElement("style");
    style.id = "dynamic-styles";
    style.textContent = `
      @keyframes ripple {
          to {
              transform: scale(4);
              opacity: 0;
          }
      }

      .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          background: var(--bg-card);
          color: var(--text-primary);
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid var(--border-primary);
          box-shadow: var(--shadow-lg);
          display: flex;
          align-items: center;
          gap: 8px;
          transform: translateX(100%);
          transition: transform 0.3s ease;
          z-index: 10000;
      }

      .toast.show {
          transform: translateX(0);
      }

      .toast-success {
          border-left: 4px solid var(--success);
      }

      .toast-error {
          border-left: 4px solid var(--error);
      }

      .toast-info {
          border-left: 4px solid var(--primary);
      }

      .loading {
          position: relative;
          pointer-events: none;
      }

      .loading::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          margin: -10px 0 0 -10px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
      }

      @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
      }

      .theme-switching {
          animation: themeSwitchPulse 0.3s ease;
      }

      @keyframes themeSwitchPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
      }

      .animate-in {
          animation: slideInUp 0.6s ease forwards;
      }

      @keyframes slideInUp {
          from {
              opacity: 0;
              transform: translateY(30px);
          }
          to {
              opacity: 1;
              transform: translateY(0);
          }
      }

      .fade-out {
          animation: fadeOut 0.3s ease forwards;
      }

      @keyframes fadeOut {
          from {
              opacity: 1;
              transform: translateY(0);
          }
          to {
              opacity: 0;
              transform: translateY(-10px);
          }
      }
  `;
    document.head.appendChild(style);
}
