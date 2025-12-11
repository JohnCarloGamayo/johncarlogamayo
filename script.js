// Theme Toggle
const html = document.documentElement;
const sidebarThemeToggle = document.getElementById('sidebarThemeToggle');

sidebarThemeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    
    const icon = sidebarThemeToggle.querySelector('i');
    const text = sidebarThemeToggle.querySelector('span');
    
    if (newTheme === 'light') {
        icon.classList.replace('fa-moon', 'fa-sun');
        text.textContent = 'Light Mode';
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        text.textContent = 'Dark Mode';
    }
    
    localStorage.setItem('theme', newTheme);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
if (savedTheme === 'light') {
    const icon = sidebarThemeToggle.querySelector('i');
    const text = sidebarThemeToggle.querySelector('span');
    icon.classList.replace('fa-moon', 'fa-sun');
    text.textContent = 'Light Mode';
}

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.getElementById('sidebar');
const mobileOverlay = document.getElementById('mobileOverlay');

mobileMenuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
});

mobileOverlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    mobileOverlay.classList.remove('active');
});

// Navigation
document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        this.classList.add('active');
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
            mobileOverlay.classList.remove('active');
        }
    });
});

// Animate Numbers
function animateNumber(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateNumber = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = target;
        }
    };
    
    updateNumber();
}

// Intersection Observer for Stats
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numberElement = entry.target.querySelector('.stat-number');
            if (numberElement && numberElement.textContent === '0') {
                animateNumber(numberElement);
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-card').forEach(card => {
    observer.observe(card);
});

// Expertise Accordion
document.querySelectorAll('.expertise-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const wasExpanded = item.classList.contains('expanded');
        
        document.querySelectorAll('.expertise-item').forEach(otherItem => {
            otherItem.classList.remove('expanded');
            const icon = otherItem.querySelector('.expertise-header i:last-child');
            icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
        });
        
        if (!wasExpanded) {
            item.classList.add('expanded');
            const icon = header.querySelector('i:last-child');
            icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
        }
    });
});

// Chat Widget
const chatBubble = document.getElementById('chatBubble');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatBody = document.getElementById('chatBody');

chatBubble.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
        chatInput.focus();
    }
});

chatClose.addEventListener('click', () => {
    chatWindow.classList.remove('active');
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (message === '') return;
    
    addMessage(message, 'user');
    chatInput.value = '';
    
    showTypingIndicator();
    
    setTimeout(() => {
        hideTypingIndicator();
        const response = getAIResponse(message);
        addMessage(response, 'bot');
    }, 1500);
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    const time = new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    
    const avatarUrl = 'images/newprofile.jpg';
    
    messageDiv.innerHTML = `
        ${sender === 'bot' ? `<img src="${avatarUrl}" alt="AI" class="message-avatar">` : ''}
        <div class="message-content">
            <p>${text}</p>
            <span class="message-time">${time}</span>
        </div>
    `;
    
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing-message';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <img src="images/newprofile.jpg" alt="AI" class="message-avatar">
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function getAIResponse(message) {
    const lowercaseMessage = message.toLowerCase();
    
    if (lowercaseMessage.includes('skill') || lowercaseMessage.includes('technology') || lowercaseMessage.includes('tech')) {
        return "John Carlo is proficient in PHP (Vanilla & Laravel), JavaScript, TypeScript, React, Python, Django, Unity C#, and Node.js. He has 2 years of freelance web development experience working with these technologies!";
    }
    
    if (lowercaseMessage.includes('experience') || lowercaseMessage.includes('work')) {
        return "John Carlo has 2 years of freelance web development experience and has worked as a Network Administrator at RMCJJ-ZapConnect. He has successfully completed 6 projects ranging from web applications to e-commerce platforms with custom AI implementations and gamified learning applications.";
    }
    
    if (lowercaseMessage.includes('project')) {
        return "John Carlo has completed 6 amazing projects: Big-Brew (coffee shop management), CyberZone (AI-powered e-commerce), Pandi Trabahunt (job matching platform), Devotion Your Emotion (emotion-based devotion platform), PC-Bulacan (e-commerce with custom AI), and DriveWise (gamified traffic learning - his capstone project)!";
    }
    
    if (lowercaseMessage.includes('big-brew') || lowercaseMessage.includes('coffee')) {
        return "Big-Brew is a comprehensive online coffee shop management system with inventory tracking, order processing, and customer management features. Built with PHP, MySQL, JavaScript, and Bootstrap.";
    }
    
    if (lowercaseMessage.includes('cyberzone') || lowercaseMessage.includes('ecommerce') || lowercaseMessage.includes('e-commerce')) {
        return "CyberZone is a modern e-commerce website featuring AI-powered chat support for enhanced customer experience and automated assistance. Built with PHP, MySQL, AI Integration, and REST API.";
    }
    
    if (lowercaseMessage.includes('pandi') || lowercaseMessage.includes('trabahunt') || lowercaseMessage.includes('job')) {
        return "Pandi Trabahunt is a comprehensive web system connecting job applicants with employers, featuring advanced job management and matching algorithms. Built with PHP and MySQL.";
    }
    
    if (lowercaseMessage.includes('devotion') || lowercaseMessage.includes('emotion')) {
        return "Devotion Your Emotion is a unique platform that creates personalized devotions based on users' emotional states, promoting mental wellness and spiritual growth. Built with PHP, MySQL, and Emotion AI.";
    }
    
    if (lowercaseMessage.includes('pc-bulacan') || lowercaseMessage.includes('pcbulacan') || lowercaseMessage.includes('bulacan')) {
        return "PC-Bulacan is an impressive e-commerce platform with custom-trained AI chat support (no paid APIs like ChatGPT!). Features order tracking and real-time customer assistance powered by John Carlo's self-trained AI model with hardcoded data. Built with Python and Django framework.";
    }
    
    if (lowercaseMessage.includes('drivewise') || lowercaseMessage.includes('drive wise') || lowercaseMessage.includes('capstone') || lowercaseMessage.includes('traffic') || lowercaseMessage.includes('driving simulator')) {
        return "DriveWise is John Carlo's capstone project - a gamified learning application for traffic law mastery and road safety! Features AI-driven cars in a driving simulator for engaging and interactive traffic education. Built with C# for the game and PHP for the admin panel and API.";
    }
    
    if (lowercaseMessage.includes('custom ai') || lowercaseMessage.includes('trained ai') || lowercaseMessage.includes('machine learning') || lowercaseMessage.includes('ai model')) {
        return "John Carlo built a custom AI chat support system for PC-Bulacan without using any paid APIs! He personally trained the AI model with hardcoded data, showcasing his machine learning skills. It's built with Python and Django.";
    }
    
    if (lowercaseMessage.includes('certificate') || lowercaseMessage.includes('certification')) {
        return "John Carlo is actively pursuing professional certifications to complement his education and work experience. He's committed to continuous learning and professional development!";
    }
    
    if (lowercaseMessage.includes('education') || lowercaseMessage.includes('school') || lowercaseMessage.includes('university') || lowercaseMessage.includes('student')) {
        return "John Carlo is currently pursuing a Bachelor of Science in Information Technology at Bulacan State University, specializing in Web and Mobile App Development. He combines academic knowledge with practical experience!";
    }
    
    if (lowercaseMessage.includes('network') || lowercaseMessage.includes('admin') || lowercaseMessage.includes('rmcjj') || lowercaseMessage.includes('zapconnect')) {
        return "John Carlo has hands-on experience as a Network Administrator at RMCJJ-ZapConnect, where he managed IT infrastructure and network operations. This role enhanced his technical skills in maintaining critical systems.";
    }
    
    if (lowercaseMessage.includes('expertise') || lowercaseMessage.includes('specializ')) {
        return "John Carlo specializes in Web Development, Game Development, Graphic Design, Digital Marketing, and Network Administration. He's flexible and can work both independently and collaboratively!";
    }
    
    if (lowercaseMessage.includes('contact') || lowercaseMessage.includes('email') || lowercaseMessage.includes('reach')) {
        return "You can reach John Carlo through the contact form on this website, or download his resume for more details. He's always open to discussing new opportunities and collaborations!";
    }
    
    if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi') || lowercaseMessage.includes('hey')) {
        return "Hello! 👋 I'm here to help you learn more about John Carlo Gamayo. Feel free to ask about his skills, experience, education, projects, or anything else you'd like to know!";
    }
    
    if (lowercaseMessage.includes('thank') || lowercaseMessage.includes('thanks')) {
        return "You're welcome! If you have any other questions about John Carlo, feel free to ask. I'm here to help! 😊";
    }
    
    if (lowercaseMessage.includes('about') || lowercaseMessage.includes('who')) {
        return "John Carlo Gamayo is a BS Information Technology student at Bulacan State University, specializing in Web and Mobile App Development. He has 2 years of freelance web development experience and worked as a Network Admin at RMCJJ-ZapConnect. He can collaborate with teams or work independently!";
    }
    
    return "That's a great question! I can tell you about John Carlo's skills, experience, education, projects, or how to contact him. What would you like to know more about?";
}

chatSend.addEventListener('click', sendMessage);

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Update Date
const dateElement = document.getElementById('currentDate');
if (dateElement) {
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', options);
    dateElement.textContent = formattedDate;
}

// Parallax Effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-bg-image');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Projects Carousel
let currentSlide = 0;
const carousel = document.getElementById('projectsCarousel');
const projectCards = document.querySelectorAll('.project-card');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');
const totalSlides = projectCards.length;

// Create dots
for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot';
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
}

const dots = document.querySelectorAll('.carousel-dot');

function updateCarousel() {
    const offset = -currentSlide * 100;
    carousel.style.transform = `translateX(${offset}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Auto-play carousel (optional)
let autoPlayInterval = setInterval(nextSlide, 5000);

// Pause on hover
carousel.addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
});

carousel.addEventListener('mouseleave', () => {
    autoPlayInterval = setInterval(nextSlide, 5000);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

// Touch/Swipe support
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchStartX - touchEndX > 50) {
        nextSlide();
    }
    if (touchEndX - touchStartX > 50) {
        prevSlide();
    }
}

// Console Message
console.log('%c👋 Hi there!', 'color: #8b7ff4; font-size: 24px; font-weight: bold;');
console.log('%cWelcome to John Carlo\'s Portfolio', 'color: #ff6b9d; font-size: 16px;');
console.log('%cLike what you see? Let\'s connect!', 'color: #4fd1c5; font-size: 14px;');
