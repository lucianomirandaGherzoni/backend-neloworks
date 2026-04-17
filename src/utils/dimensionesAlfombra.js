/**
 * Calcula las dimensiones empaquetadas y el peso de una alfombra para envío.
 *
 * Referencia base verificada (cotizada con Correo Argentino):
 *   Alfombra 100cm x 50cm → 1400g, paquete 52cm largo x 15cm ancho x 15cm alto
 */

const REFERENCIA = {
  largoAlfombra: 100,  // cm
  anchoAlfombra: 50,   // cm
  peso: 1400,          // gramos
  largoPaquete: 52,    // cm
  anchoPaquete: 15,    // cm
  altoPaquete: 15,     // cm
};

const AREA_REFERENCIA  = REFERENCIA.largoAlfombra * REFERENCIA.anchoAlfombra; // 5000 cm²
const GRAMOS_POR_CM2   = REFERENCIA.peso / AREA_REFERENCIA;                   // 0.28 g/cm²

const PESO_MAXIMO      = 25000; // gramos (límite de la API de Correo Argentino)
const DIMENSION_MAXIMA = 150;   // cm (límite de la API de Correo Argentino)
const DIMENSION_MINIMA = 1;     // cm

/**
 * @param {number} anchoAlfombra - Uno de los lados de la alfombra en cm
 * @param {number} largoAlfombra - El otro lado de la alfombra en cm
 * @returns {{ weight: number, height: number, width: number, length: number }}
 */
export const calcularDimensionesAlfombra = (anchoAlfombra, largoAlfombra) => {
  if (anchoAlfombra < DIMENSION_MINIMA || largoAlfombra < DIMENSION_MINIMA) {
    throw new Error(
      `Las dimensiones mínimas son ${DIMENSION_MINIMA}cm por lado. Recibido: ${anchoAlfombra}x${largoAlfombra}cm.`
    );
  }

  if (anchoAlfombra > DIMENSION_MAXIMA || largoAlfombra > DIMENSION_MAXIMA) {
    throw new Error(
      `Las dimensiones máximas son ${DIMENSION_MAXIMA}cm por lado. Recibido: ${anchoAlfombra}x${largoAlfombra}cm.`
    );
  }

  const area   = anchoAlfombra * largoAlfombra;
  const weight = Math.round(area * GRAMOS_POR_CM2);

  if (weight > PESO_MAXIMO) {
    throw new Error(
      `El peso calculado (${weight}g) supera el límite de la API (${PESO_MAXIMO}g). Reducí las dimensiones.`
    );
  }

  // El lado más largo determina el largo del paquete
  const ladoMayor  = Math.max(anchoAlfombra, largoAlfombra);
  const factorLargo = ladoMayor / REFERENCIA.largoAlfombra;
  const length     = Math.round(REFERENCIA.largoPaquete * factorLargo);

  // Ancho y alto escalan proporcionalmente si el área supera la referencia
  const factorArea = area / AREA_REFERENCIA;
  const width  = factorArea > 1
    ? Math.round(REFERENCIA.anchoPaquete * Math.sqrt(factorArea))
    : REFERENCIA.anchoPaquete;
  const height = factorArea > 1
    ? Math.round(REFERENCIA.altoPaquete * Math.sqrt(factorArea))
    : REFERENCIA.altoPaquete;

  return { weight, height, width, length };
};
