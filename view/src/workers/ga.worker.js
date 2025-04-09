// ga.worker.js - không dùng import ngoài, gộp toàn bộ logic GA bên trong
/* eslint-disable no-restricted-globals */

function runGeneticAlgorithm(products, locations, generations = 30, populationSize = 20) {
    const getVolume = (sp) => (sp.chieuDai || 1) * (sp.chieuRong || 1) * (sp.chieuCao || 1);
    const population = Array.from({ length: populationSize }, () => generateRandomSolution(products, locations));

    for (let g = 0; g < generations; g++) {
        population.sort((a, b) => fitness(b, products, locations) - fitness(a, products, locations));
        const parents = population.slice(0, 5);
        const children = [];
        while (children.length < populationSize - parents.length) {
            const p1 = parents[Math.floor(Math.random() * parents.length)];
            const p2 = parents[Math.floor(Math.random() * parents.length)];
            children.push(crossover(p1, p2));
        }
        population.splice(0, population.length, ...parents, ...children);
    }

    return population[0];

    function generateRandomSolution(products, locations) {
        const solution = {};
        const used = {};
        for (const sp of products) {
            const vol = getVolume(sp);
            let qtyLeft = sp.soLuong;
            solution[sp.idSanPham] = [];

            const shuffled = [...locations].sort(() => Math.random() - 0.5);
            for (const loc of shuffled) {
                const free = (loc.sucChua || 0) - (loc.daDung || 0) - (used[loc.idViTri] || 0);
                const fitQty = Math.min(Math.floor(free / vol), qtyLeft);
                if (fitQty > 0) {
                    solution[sp.idSanPham].push({ viTri: loc.idViTri, soLuong: fitQty });
                    used[loc.idViTri] = (used[loc.idViTri] || 0) + fitQty * vol;
                    qtyLeft -= fitQty;
                    if (qtyLeft <= 0) break;
                }
            }
        }
        return solution;
    }

    function fitness(solution, products, locations) {
        let totalUsed = 0, totalWaste = 0;
        const locMap = Object.fromEntries(locations.map(l => [l.idViTri, l]));
        const used = {};
        for (const sp of products) {
            const vol = getVolume(sp);
            for (const alloc of solution[sp.idSanPham] || []) {
                const vt = alloc.viTri;
                const qty = alloc.soLuong;
                const loc = locMap[vt];
                if (!loc) continue;
                const cap = (loc.sucChua || 0) - (loc.daDung || 0);
                const usedVol = qty * vol;
                totalUsed += usedVol;
                used[vt] = (used[vt] || 0) + usedVol;
                if (used[vt] > cap) totalWaste += used[vt] - cap;
            }
        }
        return totalUsed - totalWaste;
    }

    function crossover(a, b) {
        const child = {};
        for (const key in a) {
            child[key] = Math.random() < 0.5 ? a[key] : b[key];
        }
        return child;
    }
}

self.onmessage = function (e) {
    const { products, locations } = e.data;
    try {
        const result = runGeneticAlgorithm(products, locations);
        self.postMessage({ success: true, data: result });
    } catch (err) {
        self.postMessage({ success: false, error: err.message });
    }
};