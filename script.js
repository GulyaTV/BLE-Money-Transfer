async function startVideo() {
    const video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function detectDogs() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const model = await cocoSsd.load();

    const resultElement = document.getElementById('result');

    async function detect() {
        const predictions = await model.detect(video);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        predictions.forEach(prediction => {
            const { class: className, score, bbox } = prediction;

            if (className === 'dog' && score > 0.5) {
                resultElement.textContent = 'Зафиксирована собака!';

                const [x, y, width, height] = bbox;
                ctx.strokeStyle = 'green';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, width, height);
            } else {
                resultElement.textContent = '';
            }
        });

        requestAnimationFrame(detect);
    }

    detect();
}

startVideo().then(detectDogs);
