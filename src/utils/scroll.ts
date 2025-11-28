export const scrollToSection = (id: string, offset: number = -100) => {
  const element = document.getElementById(id);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY + offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};
