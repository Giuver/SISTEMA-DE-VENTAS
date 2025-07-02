import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AnimatedBackground = ({ children }) => {
    const canvasRef = useRef(null);
    const theme = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;
        let particles = [];

        // Configurar canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Clase de partícula
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.color = theme.palette.mode === 'dark'
                    ? `rgba(58, 141, 222, ${this.opacity})`
                    : `rgba(25, 118, 210, ${this.opacity})`;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Rebotar en los bordes
                if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
                if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;

                // Mantener dentro del canvas
                this.x = Math.max(0, Math.min(canvas.width, this.x));
                this.y = Math.max(0, Math.min(canvas.height, this.y));
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        // Crear partículas
        const createParticles = () => {
            particles = [];
            const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 20000));

            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        // Dibujar conexiones entre partículas
        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        const opacity = (100 - distance) / 100 * 0.3;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = theme.palette.mode === 'dark'
                            ? `rgba(58, 141, 222, ${opacity})`
                            : `rgba(25, 118, 210, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        }

        // Función de animación
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Actualizar y dibujar partículas
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Dibujar conexiones
            drawConnections();

            animationId = requestAnimationFrame(animate);
        };

        // Inicializar
        createParticles();
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationId);
        };
    }, [theme.palette.mode]);

    return (
        <Box sx={{ position: 'relative', minHeight: '100vh' }}>
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -1,
                    pointerEvents: 'none'
                }}
            />
            {children}
        </Box>
    );
};

export default AnimatedBackground; 