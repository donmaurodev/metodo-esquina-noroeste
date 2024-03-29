document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('input-form');
  const recalculateBtn = document.getElementById('recalculate-btn');

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const providers = parseInt(document.getElementById('providers').value);
    const customers = parseInt(document.getElementById('customers').value);

    // Ocultar el formulario después de enviar los datos
    form.style.display = 'none';
    recalculateBtn.style.display = 'block';

    // Crear campos de entrada para oferta y demanda
    const demandInputs = [];
    let html = '';

    html += '<table>';
    html += '<tr><th></th>';
    for (let j = 0; j < customers; j++) {
      html += `<th>Cliente ${j + 1}</th>`;
    }
    html += '<th>Oferta</th></tr>';
    for (let i = 0; i < providers; i++) {
      html += `<tr><td>Proveedor ${i + 1}</td>`;
      for (let j = 0; j < customers; j++) {
        html += `<td><input type="number" class="cost" placeholder="Costo ${i + 1}-${j + 1}" required></td>`;
      }
      html += `<td><input type="number" class="supply" placeholder="Oferta Proveedor ${i + 1}" required></td>`;
      html += '</tr>';
    }
    html += '<tr><th>Demanda</th>';
    for (let j = 0; j < customers; j++) {
      demandInputs.push(`<td><input type="number" class="demand" placeholder="Demanda Cliente ${j + 1}" required></td>`);
    }
    html += demandInputs.join('');
    html += '<td></td></tr></table>';
    html += '<button id="calculate-btn" type="button">Calcular</button>';

    const output = document.getElementById('output');
    output.innerHTML = html;

    // Agregar evento de clic al botón de cálculo
    document.getElementById('calculate-btn').addEventListener('click', function() {
      const supply = [];
      const demand = [];
      const costs = [];

      // Ocultar campos de entrada
      const supplyElements = document.getElementsByClassName('supply');
      const demandElements = document.getElementsByClassName('demand');
      const costElements = document.getElementsByClassName('cost');

      // Validar campos de entrada
      for (let i = 0; i < costElements.length; i++) {
        if (!costElements[i].value) {
          alert('Por favor, complete todos los campos antes de calcular.');
          return;
        }
      }

      for (let i = 0; i < supplyElements.length; i++) {
        if (!supplyElements[i].value) {
          alert('Por favor, complete todos los campos antes de calcular.');
          return;
        }
      }

      for (let i = 0; i < demandElements.length; i++) {
        if (!demandElements[i].value) {
          alert('Por favor, complete todos los campos antes de calcular.');
          return;
        }
      }

      for (let i = 0; i < supplyElements.length; i++) {
        supply.push(parseInt(supplyElements[i].value));
        supplyElements[i].style.display = 'none';
      }

      for (let j = 0; j < demandElements.length; j++) {
        demand.push(parseInt(demandElements[j].value));
        demandElements[j].style.display = 'none';
      }

      const calculateBtn = document.getElementById('calculate-btn');
      calculateBtn.style.display = 'none';

      // Obtener los costos de transporte
      let index = 0;
      for (let i = 0; i < providers; i++) {
        const row = [];
        for (let j = 0; j < customers; j++) {
          const cost = parseInt(costElements[index].value);
          row.push(cost);
          costElements[index].style.display = 'none';
          index++;
        }
        costs.push(row);
      }

      // Mostrar una tabla con los valores ingresados por el usuario
      let userInputTable = '<h3>Valores Ingresados:</h3><table>';
      userInputTable += '<tr><th></th>';
      for (let j = 0; j < customers; j++) {
        userInputTable += `<th>Cliente ${j + 1}</th>`;
      }
      userInputTable += '<th>Oferta</th></tr>';
      for (let i = 0; i < providers; i++) {
        userInputTable += `<tr><td>Proveedor ${i + 1}</td>`;
        for (let j = 0; j < customers; j++) {
          userInputTable += `<td>${costs[i][j]}</td>`;
        }
        userInputTable += `<td>${supply[i]}</td></tr>`;
      }
      userInputTable += '<tr><th>Demanda</th>';
      for (let j = 0; j < customers; j++) {
        userInputTable += `<td>${demand[j]}</td>`;
      }
      userInputTable += '<td></td></tr></table>';
      output.innerHTML += userInputTable;

      // Calcular el resultado utilizando el método de la esquina noroeste
      const result = northwestCorner(supply, demand, costs);
      output.innerHTML += `<h3>Resultado:</h3><p>El costo mínimo total es: ${result.totalCost}</p>`;
      output.innerHTML += '<h3>Asignación:</h3>';
      for (const allocation of result.allocation) {
        const [i, j, units] = allocation;
        output.innerHTML += `<p>Se asignan ${units} unidades desde Proveedor ${i + 1} a Cliente ${j + 1}</p>`;
      }      
    });

    recalculateBtn.addEventListener('click', function() {
      // Limpiar resultados
      const output = document.getElementById('output');
      output.innerHTML = '';
  
      // Mostrar el formulario nuevamente
      form.style.display = 'block';
      recalculateBtn.style.display = 'none';
    });

  });
});

function northwestCorner(supply, demand, costs) {
  let totalCost = 0;
  const allocation = [];
  let i = 0;
  let j = 0;

  while (i < supply.length && j < demand.length) {
    const units = Math.min(supply[i], demand[j]);
    totalCost += units * costs[i][j];
    supply[i] -= units;
    demand[j] -= units;
    allocation.push([i, j, units]);

    if (supply[i] === 0) {
      i++;
    }
    if (demand[j] === 0) {
      j++;
    }
  }

  return { totalCost, allocation };
}
