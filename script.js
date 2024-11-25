const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to fill the viewport
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Particle settings
const particles = [];
const particleCount = 80; // Number of particles
const maxDistance = 120; // Maximum distance between particles to draw a line

// Create particles (atoms)
function createParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1.5, // Velocity in X direction
            vy: (Math.random() - 0.5) * 1.5, // Velocity in Y direction
            size: 3 + Math.random() * 2 // Size of each particle
        });
    }
}
createParticles();

document.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-list a');
    
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 50) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});



// Draw particles and lines between close ones
function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
        // Move particle
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle (atom)
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = '#00d1b2'; // Teal color for the atoms
        ctx.fill();

        // Draw lines between particles close to each other
        for (let j = index + 1; j < particles.length; j++) {
            const otherParticle = particles[j];
            const dist = Math.hypot(particle.x - otherParticle.x, particle.y - otherParticle.y);
            if (dist < maxDistance) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.strokeStyle = `rgba(0, 209, 178, ${1 - dist / maxDistance})`; // Fades line with distance
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    });
}

window.addEventListener('scroll', function() {
    let offset = window.pageYOffset;
    document.querySelector('.particles-background').style.backgroundPositionY = offset * 0.5 + 'px';
});


// Animation loop
function animate() {
    drawParticles();
    requestAnimationFrame(animate);
}
animate();
