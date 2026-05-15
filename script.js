document.addEventListener('DOMContentLoaded', () => {
  const iconMenu = document.getElementById('iconMenu');
  const closeMenu = document.getElementById('closeMenu');
  const logoImg = document.querySelector('.logoMaster img');
  const iconMenuSvgPaths = document.querySelectorAll('#iconMenu path');
  const menuLinks = document.querySelectorAll('#menuOptions a');
  const sideMenuLogoLink = document.querySelector('.sideMenuTop a');

  iconMenu.addEventListener('click', () => {
    document.body.classList.add('menu-open');
  });

  closeMenu.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
  });

  // Fechar o menu e marcar como ativo ao clicar nos links
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      document.body.classList.remove('menu-open');
    });
  });

  // Fechar ao clicar no logo do menu lateral também
  if (sideMenuLogoLink) {
    sideMenuLogoLink.addEventListener('click', () => {
      menuLinks.forEach(l => l.classList.remove('active'));
      document.body.classList.remove('menu-open');
    });
  }

  const sections = document.querySelectorAll('section');
  
  const updateNavOnScroll = () => {
    let currentSection = 'home';
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120) {
        currentSection = section.id;
      }
    });

    if (currentSection === 'home') {
      logoImg.src = './img/icons/logoNavHome.svg';
      iconMenuSvgPaths.forEach(path => path.setAttribute('stroke', 'black'));
    } else if (currentSection === 'bio') {
      logoImg.src = './img/icons/logoNavBio.svg';
      iconMenuSvgPaths.forEach(path => path.setAttribute('stroke', 'white'));
    } else if (currentSection === 'jobs') {
      logoImg.src = './img/icons/logoNavJobs.svg';
      iconMenuSvgPaths.forEach(path => path.setAttribute('stroke', '#4B4B4B'));
    }
  };

  window.addEventListener('scroll', updateNavOnScroll);
  updateNavOnScroll();

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
