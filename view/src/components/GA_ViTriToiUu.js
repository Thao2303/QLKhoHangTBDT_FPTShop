function runGeneticAlgorithm(products, locations, maxGenerations = 100, populationSize = 50) {
    const population = Array.from({ length: populationSize }, () =>
        generateChromosome(products, locations)
    );

    for (let gen = 0; gen < maxGenerations; gen++) {
        population.sort((a, b) =>
            fitness(b, products, locations) - fitness(a, products, locations)
        );
        const nextGen = population.slice(0, populationSize / 2);

        while (nextGen.length < populationSize) {
            const parent1 = selectRandom(nextGen);
            const parent2 = selectRandom(nextGen);
            const child = crossover(parent1, parent2);
            mutate(child, products, locations);
            nextGen.push(child);
        }

        population.length = 0;
        population.push(...nextGen);
    }

    population.sort((a, b) => fitness(b, products, locations) - fitness(a, products, locations));
    return population[0];
}

function generateChromosome(products, locations) {
    const gene = {};
    products.forEach(sp => {
        const vol = (sp.chieuDai || 1) * (sp.chieuRong || 1) * (sp.chieuCao || 1);
        let qty = sp.soLuong;
        const possible = [...locations].filter(loc => (loc.sucChua - loc.daDung) >= vol);
        gene[sp.idSanPham] = [];
        while (qty > 0 && possible.length > 0) {
            const loc = possible[Math.floor(Math.random() * possible.length)];
            const freeVol = loc.sucChua - loc.daDung;
            const maxFit = Math.floor(freeVol / vol);
            const used = Math.min(maxFit, qty);
            if (used > 0) {
                gene[sp.idSanPham].push({ viTri: loc.idViTri, soLuong: used });
                loc.daDung += used * vol;
                qty -= used;
            }
        }
    });
    return gene;
}
function fitness(gene, products, locations) {
    let score = 0;
    const used = {};

    for (let sp of products) {
        const rows = gene[sp.idSanPham] || [];
        const vol = (sp.chieuDai || 1) * (sp.chieuRong || 1) * (sp.chieuCao || 1);
        let total = 0;

        for (let row of rows) {
            if (!row || typeof row.idViTri === 'undefined') continue;
            total += row.soLuong || 0;

            const loc = locations.find(l => l.idViTri === row.idViTri);
            if (!loc) continue;

            used[loc.idViTri] = (used[loc.idViTri] || 0) + (row.soLuong || 0) * vol;
        }

        if (total === sp.soLuong) score += 100;
        score -= rows.length * 2;
    }

    for (let locId in used) {
        const loc = locations.find(l => l.idViTri == locId);
        if (!loc) continue;
        if (used[locId] > (loc.sucChua - loc.daDung)) {
            score -= 1000;
        }
    }

    return score;
}


function crossover(parent1, parent2) {
    const child = {};
    for (let key in parent1) {
        child[key] = Math.random() < 0.5 ? parent1[key] : parent2[key];
    }
    return child;
}

function mutate(gene, products, locations) {
    const sp = products[Math.floor(Math.random() * products.length)];
    gene[sp.idSanPham] = generateChromosome([sp], locations)[sp.idSanPham];
}

function selectRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export default runGeneticAlgorithm;
