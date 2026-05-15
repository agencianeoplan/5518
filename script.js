document.addEventListener('DOMContentLoaded', () => {
  const iconMenus = document.querySelectorAll('.iconMenu');
  const closeMenu = document.getElementById('closeMenu');
  const menuLinks = document.querySelectorAll('#menuOptions a');
  const sideMenuLogoLink = document.querySelector('.sideMenuTop a');

  iconMenus.forEach(icon => {
    icon.addEventListener('click', () => {
      document.body.classList.add('menu-open');
    });
  });

  closeMenu.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
  });

  // Fechar o menu e rolar para a seção correta
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      document.body.classList.remove('menu-open');

      if (targetId === 'jobs') {
        const bioSectionObj = document.getElementById('bio');
        if (bioSectionObj) {
          const bioHeight = bioSectionObj.offsetHeight;
          const bioTop = bioSectionObj.offsetTop;
          const speed = 1.3;
          const maxScroll = bioHeight / speed;
          
          window.scrollTo({
            top: bioTop + maxScroll,
            behavior: 'smooth'
          });
        }
      } else if (targetId === 'footer') {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      } else if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Atualizar o item ativo do menu no scroll
  const updateActiveMenuOnScroll = () => {
    const scrollY = window.scrollY;
    const bioSectionObj = document.getElementById('bio');
    
    if (!bioSectionObj) return;

    const bioTop = bioSectionObj.offsetTop;
    const bioHeight = bioSectionObj.offsetHeight;
    const speed = 1.3;
    const maxScroll = bioHeight / speed;
    
    let currentActive = 'home';
    
    if (scrollY >= bioTop - 150 && scrollY < bioTop + (maxScroll / 2)) {
      currentActive = 'bio';
    } else if (scrollY >= bioTop + (maxScroll / 2)) {
      currentActive = 'jobs';
    }
    
    const footerObj = document.getElementById('footer');
    if (footerObj && scrollY >= footerObj.offsetTop - window.innerHeight + 100) {
      currentActive = 'footer';
    }

    menuLinks.forEach(link => {
      const targetId = link.getAttribute('href').substring(1);
      if (targetId === currentActive) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveMenuOnScroll);
  updateActiveMenuOnScroll();

  // Fechar ao clicar no logo do menu lateral também
  if (sideMenuLogoLink) {
    sideMenuLogoLink.addEventListener('click', () => {
      menuLinks.forEach(l => l.classList.remove('active'));
      document.body.classList.remove('menu-open');
    });
  }



  const bioSectionObj = document.getElementById('bio');
  const jobsSectionObj = document.getElementById('jobs');
  const footerSectionObj = document.getElementById('footer');
  
  let bioHeight = 0;
  let bioTop = 0;

  const updateParallax = () => {
    if (!bioSectionObj || !jobsSectionObj) return;
    
    bioHeight = bioSectionObj.offsetHeight;
    bioTop = bioSectionObj.offsetTop;
    
    jobsSectionObj.style.marginTop = `-${bioHeight}px`;

    const speed = 1.3;
    const maxScroll = bioHeight / speed;
    
    // Add padding to body to compensate for the parallax translateY
    // This allows the user to scroll fully to the end of the parallax effect
    if (document.body.style.paddingBottom !== `${maxScroll}px`) {
      document.body.style.paddingBottom = `${maxScroll}px`;
    }

    const currentScrollTop = window.scrollY;
    
    if (currentScrollTop < bioTop) {
      jobsSectionObj.style.visibility = 'hidden';
      bioSectionObj.style.transform = `translateY(0px)`;
      jobsSectionObj.style.transform = `translateY(0px)`;
      if (footerSectionObj) footerSectionObj.style.transform = `translateY(0px)`;
    } else {
      jobsSectionObj.style.visibility = 'visible';
      
      const speed = 1.3; // 30% mais rápido
      const maxScroll = bioHeight / speed;
      const scrolledPastBio = currentScrollTop - bioTop;
      
      if (scrolledPastBio <= maxScroll) {
        const bioOffset = -(speed - 1) * scrolledPastBio;
        const jobsOffset = scrolledPastBio;
        
        bioSectionObj.style.transform = `translateY(${bioOffset}px)`;
        jobsSectionObj.style.transform = `translateY(${jobsOffset}px)`;
        if (footerSectionObj) footerSectionObj.style.transform = `translateY(${jobsOffset}px)`;
      } else {
        const bioOffset = -(speed - 1) * maxScroll;
        const jobsOffset = maxScroll;
        
        bioSectionObj.style.transform = `translateY(${bioOffset}px)`;
        jobsSectionObj.style.transform = `translateY(${jobsOffset}px)`;
        if (footerSectionObj) footerSectionObj.style.transform = `translateY(${jobsOffset}px)`;
      }
    }
  };

  window.addEventListener('scroll', updateParallax);
  window.addEventListener('resize', updateParallax);
  updateParallax();
  // Images Spin Logic
  const imagesGroup = document.querySelector('.imagesGroup');
  if (imagesGroup) {
    let currentAngle = 0;
    let currentSpeed = 0.15;
    let targetSpeed = 0.15;
    const MAX_SPEED = 0.15; 

    // Detecta hover em cada imagem para parar a roda
    const wrappers = imagesGroup.querySelectorAll('.imgWrapper');
    wrappers.forEach(wrapper => {
      wrapper.addEventListener('mouseenter', () => {
        targetSpeed = 0; // Começa a frear
      });
      wrapper.addEventListener('mouseleave', () => {
        targetSpeed = MAX_SPEED; // Volta a acelerar
      });
    });

    function smoothSpin() {
      // Lerp (interpolação linear) apenas na velocidade, para parada e retomada suaves
      currentSpeed += (targetSpeed - currentSpeed) * 0.05;
      
      // Adiciona a velocidade atual ao ângulo
      currentAngle += currentSpeed;
      
      imagesGroup.style.setProperty('--spin-angle', `${currentAngle}deg`);
      
      requestAnimationFrame(smoothSpin);
    }
    
    // Inicia o loop de animação
    smoothSpin();
  }

  // Job Preview Logic
  const jobPreviewEl = document.getElementById('jobPreview');
  const previewJobName = document.getElementById('previewJobName');
  const previewJobImage = document.getElementById('previewJobImage');
  const previewJobCategory = document.getElementById('previewJobCategory');
  const previewJobCountry = document.getElementById('previewJobCountry');
  const previewJobDescription = document.getElementById('previewJobDescription');
  const previewJobLink = document.getElementById('previewJobLink');
  const closePreviewBtn = document.getElementById('closePreview');
  const nextPreviewBtn = document.getElementById('nextPreview');

  let jobsData = [];
  let currentJobIndex = 0;

  if (imagesGroup) {
    // Parse job data from data attribute
    const jobsDataStr = imagesGroup.getAttribute('data-jobs');
    if (jobsDataStr) {
      jobsData = JSON.parse(jobsDataStr);
    }

    // Add click listeners to image wrappers
    const imgWrappers = imagesGroup.querySelectorAll('.imgWrapper');
    imgWrappers.forEach((wrapper, index) => {
      wrapper.addEventListener('click', (e) => {
        const jobId = wrapper.getAttribute('data-job-id');
        currentJobIndex = jobsData.findIndex(job => job.id === jobId);
        if (currentJobIndex !== -1) {
          showJobPreview();
        }
      });
    });
  }

  function showJobPreview() {
    if (currentJobIndex < 0 || currentJobIndex >= jobsData.length) {
      return;
    }

    const job = jobsData[currentJobIndex];
    previewJobName.textContent = job.name;
    previewJobImage.src = job.image;
    previewJobImage.alt = job.name;
    previewJobCategory.textContent = job.category;
    previewJobCountry.textContent = job.country;
    previewJobDescription.textContent = job.description;
    previewJobLink.href = job.detailLink;

    jobPreviewEl.classList.remove('hidden');
    jobPreviewEl.classList.add('visible');

    // Scroll to preview
    jobPreviewEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function closeJobPreview() {
    jobPreviewEl.classList.remove('visible');
    jobPreviewEl.classList.add('hidden');
  }

  function showNextJob() {
    currentJobIndex = (currentJobIndex + 1) % jobsData.length;
    showJobPreview();
  }

  function showPreviousJob() {
    currentJobIndex = (currentJobIndex - 1 + jobsData.length) % jobsData.length;
    showJobPreview();
  }

  // Add event listeners to preview buttons
  if (closePreviewBtn) {
    closePreviewBtn.addEventListener('click', closeJobPreview);
  }

  if (nextPreviewBtn) {
    nextPreviewBtn.addEventListener('click', showNextJob);
  }
});
    nextPreviewBtn.addEventListener('click', showNextJob);
