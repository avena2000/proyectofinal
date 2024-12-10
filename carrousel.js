function autoplayCarousel() {
  const carouselEl = document.getElementById("carousel");
  const slideContainerEl = carouselEl.querySelector("#slide-container");
  const slides = Array.from(slideContainerEl.querySelectorAll(".slide"));
  const slideIndicators = Array.from(carouselEl.querySelectorAll(".slide-indicator"));
  const backButton = document.querySelector("#back-button");
  const forwardButton = document.querySelector("#forward-button");

  let slideWidth = slides[0].offsetWidth;
  let autoplay;

  const getGap = () => {
    const styles = window.getComputedStyle(slideContainerEl);
    return parseFloat(styles.getPropertyValue('gap')) || 0;
  };

  const getNewScrollPosition = (arg) => {
    const gap = getGap();
    const maxScrollLeft = slideContainerEl.scrollWidth - slideContainerEl.clientWidth; // Ajustado
    const tolerance = 2;

    if (arg === "forward") {
      const x = slideContainerEl.scrollLeft + slideWidth + gap;
      return x <= maxScrollLeft + tolerance ? x : 0;
    } else if (arg === "backward") {
      const x = slideContainerEl.scrollLeft - slideWidth - gap;
      return x >= -tolerance ? x : maxScrollLeft;
    } else if (typeof arg === "number") {
      return arg * (slideWidth + gap);
    }
  };


  // Función para navegar entre diapositivas
  const navigate = (arg) => {
    slideContainerEl.scrollLeft = getNewScrollPosition(arg);
  };

  // Actualizar indicadores activos
  const updateIndicators = (index) => {
    carouselEl.querySelector(".slide-indicator.active")?.classList.remove("active");
    slideIndicators[index]?.classList.add("active");
  };

  // Observador para las diapositivas
  const slideObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateIndicators(Number(entry.target.dataset.slideindex));
          }
        });
      },
      { root: slideContainerEl, threshold: 0.1 }
  );

  slides.forEach((slide, index) => {
    slide.dataset.slideindex = index;
    slideObserver.observe(slide);
  });

  // Inicializar botones
  if (backButton) {
    backButton.addEventListener("click", () => {
      clearAutoplay(); // Pausa el autoplay temporalmente
      navigate("backward");
    });
  }

  if (forwardButton) {
    forwardButton.addEventListener("click", () => {
      clearAutoplay(); // Pausa el autoplay temporalmente
      navigate("forward");
    });
  }

  // Inicializar indicadores
  slideIndicators.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      clearAutoplay();
      navigate(index);
    });
    dot.addEventListener("mouseenter", clearAutoplay);
  });

  // Manejo del teclado
  document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft") {
      clearAutoplay();
      navigate("backward");
    } else if (e.code === "ArrowRight") {
      clearAutoplay();
      navigate("forward");
    }
  });

  // Actualizar ancho de diapositiva al redimensionar
  window.addEventListener("resize", () => {
    slideWidth = slides[0].offsetWidth;
  });

  // Autoplay
  const startAutoplay = () => {
    autoplay = setInterval(() => navigate("forward"), 3000);
  };

  const clearAutoplay = () => {
    clearInterval(autoplay);
  };

  slideContainerEl.addEventListener("mouseenter", clearAutoplay);
  slideContainerEl.addEventListener("mouseleave", startAutoplay);

  startAutoplay();
}
autoplayCarousel();
