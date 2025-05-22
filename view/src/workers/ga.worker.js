/* eslint-disable no-restricted-globals */

// GA Core
function runGeneticAlgorithm(products, locations, generations = 30, populationSize = 20, oldPositions = {}) {
    const population = Array.from({ length: populationSize }, () =>
        generateRandomSolution(products, locations, oldPositions)
    );

    for (let g = 0; g < generations; g++) {
        population.sort((a, b) => fitness(b, products, locations, oldPositions) - fitness(a, products, locations, oldPositions));
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
}

// Tạo giải pháp ngẫu nhiên
function generateRandomSolution(products, locations, oldPositions) {
    const solution = {};
    const used = {};

    for (const sp of products) {
        const vol = (sp.chieuDai || 1) * (sp.chieuRong || 1) * (sp.chieuCao || 1);
        let qtyLeft = sp.soLuong;
        solution[sp.idSanPham] = [];

        const oldLocIds = oldPositions[sp.idSanPham] || [];
        const oldLocObjects = oldLocIds.map(id => locations.find(l => l.idViTri === id)).filter(Boolean);

        let targetZone = "";
        if (oldLocObjects.length > 0) {
            targetZone = oldLocObjects[0].day?.trim().toUpperCase();
        }

        const remainingLocs = locations.filter(loc => !oldLocIds.includes(loc.idViTri));

        const sameZoneLocs = remainingLocs
            .filter(loc => loc.day?.trim().toUpperCase() === targetZone)
            .sort((a, b) => a.cot - b.cot || a.tang - b.tang);

        const otherLocs = remainingLocs
            .filter(loc => loc.day?.trim().toUpperCase() !== targetZone)
            .sort((a, b) => a.day.localeCompare(b.day) || a.cot - b.cot || a.tang - b.tang);

        const combined = [...oldLocObjects, ...sameZoneLocs, ...otherLocs];

        for (const loc of combined) {
            if (!loc) continue;
            const free = (loc.sucChua || 0) - (loc.daDung || 0) - (used[loc.idViTri] || 0);

            if (free > 0) {
                const fitQty = Math.min(Math.floor(free / vol), qtyLeft);
                if (fitQty > 0) {
                    solution[sp.idSanPham].push({ viTri: loc.idViTri, soLuong: fitQty });
                    used[loc.idViTri] = (used[loc.idViTri] || 0) + fitQty * vol;
                    qtyLeft -= fitQty;
                    if (qtyLeft <= 0) break;
                }
            }
        }
    }

    return solution;
}

// Tính điểm fitness
function fitness(solution, products, locations, oldPositions) {
    let totalUsed = 0, totalWaste = 0, bonus = 0;
    const locMap = Object.fromEntries(locations.map(l => [l.idViTri, l]));
    const used = {};

    for (const sp of products) {
        const vol = (sp.chieuDai || 1) * (sp.chieuRong || 1) * (sp.chieuCao || 1);

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

            if ((oldPositions[sp.idSanPham] || []).includes(vt)) bonus += 10;

            if ((sp.soLanNhap || 0) > 10 && isNearReceivingArea(loc)) bonus += 5;
            if ((sp.soLanXuat || 0) > 10 && isNearShippingArea(loc)) bonus += 5;
            if (sp.zoneGoiY && loc.day === sp.zoneGoiY) bonus += 3;
        }
    }

    return totalUsed - totalWaste + bonus;
}

// Ưu tiên khu vực
function isNearReceivingArea(loc) {
    return loc.khuVuc?.loaiKhuVuc === 'nhap';
}
function isNearShippingArea(loc) {
    return loc.khuVuc?.loaiKhuVuc === 'xuat';
}

// Lai tạo
function crossover(a, b) {
    const child = {};
    for (const key in a) {
        child[key] = Math.random() < 0.5 ? a[key] : b[key];
    }
    return child;
}

// Worker
self.onmessage = function (e) {
    const { products, locations, oldPositions } = e.data;
    try {
        const result = runGeneticAlgorithm(products, locations, 30, 20, oldPositions);
        self.postMessage({ success: true, data: result });
    } catch (err) {
        self.postMessage({ success: false, error: err.message });
    }
};
