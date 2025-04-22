document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle functionality
  const themeToggle = document.getElementById("theme-toggle")
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)")

  // Check for saved theme preference or use the system preference
  const currentTheme = localStorage.getItem("theme") || (prefersDarkScheme.matches ? "dark" : "light")

  // Apply the theme
  if (currentTheme === "dark") {
    document.body.classList.add("dark")
  } else {
    document.body.classList.remove("dark")
  }

  // Theme toggle click handler
  themeToggle.addEventListener("click", () => {
    if (document.body.classList.contains("dark")) {
      document.body.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      document.body.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
  })

  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle")
  const mobileMenu = document.getElementById("mobile-menu")

  mobileMenuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("open")
  })

  // Close mobile menu when clicking a link
  const mobileNavLinks = document.querySelectorAll(".mobile-nav a")
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open")
    })
  })

  // Scroll animations
  const animatedElements = document.querySelectorAll(".animate-on-scroll")

  // Initial check for elements in viewport
  checkElementsInViewport()

  // Check elements on scroll
  window.addEventListener("scroll", checkElementsInViewport)

  function checkElementsInViewport() {
    animatedElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const elementVisible = 150

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add("visible")
      }
    })
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for header height
          behavior: "smooth",
        })
      }
    })
  })

  // Background animation for hero section
  const bgCircle1 = document.querySelector(".bg-circle-1")
  const bgCircle2 = document.querySelector(".bg-circle-2")

  // Add parallax effect on mouse move
  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX / window.innerWidth
    const mouseY = e.clientY / window.innerHeight

    bgCircle1.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px) scale(1) rotate(0deg)`
    bgCircle2.style.transform = `translate(${-mouseX * 20}px, ${-mouseY * 20}px) scale(1) rotate(0deg)`
  })
})
