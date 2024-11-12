// perlin.js

function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a, b, t) {
    return a + t * (b - a);
}

function grad(hash, x) {
    return (hash & 1) === 0 ? x : -x;
}

function perlinNoise(x) {
    let xi = Math.floor(x) & 255;
    let xf = x - Math.floor(x);
    let u = fade(xf);

    let aa = grad(xi, xf);
    let bb = grad(xi + 1, xf - 1);

    return lerp(aa, bb, u);
}

function perlinOctave(x, octaves, persistence) {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
        total += perlinNoise(x * frequency) * amplitude;

        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= 2;
    }

    return total / maxValue;
}

export { perlinOctave };