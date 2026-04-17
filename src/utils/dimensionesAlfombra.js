/**
 * Calcula las dimensiones empaquetadas y el peso de una alfombra para envío.
 *
 * Referencia base verificada (cotizada con Correo Argentino):
 *   Alfombra 100cm x 50cm → 1400g, paquete 52cm largo x 15cm ancho x 15cm alto
 *
 * Ratios de escalado:
 *   Peso:              área × 0.28 g/cm²
 *   Largo del paquete: ladoLargo × 0.52
 *   Ancho del paquete: ladoCorto × 0.30
 *   Alto del paquete:  ladoCorto × 0.30
 */

const RATIO_PESO   = 0.28;  // g/cm²
const RATIO_LARGO  = 0.52;  // largo paquete / lado largo alfombra
const RATIO_ANCHO  = 0.30;  // ancho paquete / lado corto alfombra
const RATIO_ALTO   = 0.30;  // alto paquete  / lado corto alfombra

const PESO_MAXIMO      = 25000; // gramos (límite de la API de Correo Argentino)
const DIMENSION_MAXIMA = 150;   // cm (límite de la API de Correo Argentino)

/**
 * @param {number} anchoAlfombra - Uno de los lados de la alfombra en cm (el orden no importa)
 * @param {number} largoAlfombra - El otro lado de la alfombra en cm (el orden no importa)
 * @returns {{ weight: number, length: number, width: number, height: number }}
 */
export const calcularDimensionesAlfombra = (anchoAlfombra, largoAlfombra) => {
  if (anchoAlfombra <= 0 || largoAlfombra <= 0) {
    throw new Error(
      `Las dimensiones deben ser mayores a 0. Recibido: ${anchoAlfombra}x${largoAlfombra}cm.`
    );
  }

  const ladoLargo = Math.max(anchoAlfombra, largoAlfombra);
  const ladoCorto = Math.min(anchoAlfombra, largoAlfombra);

  const area   = anchoAlfombra * largoAlfombra;
  const weight = Math.round(area * RATIO_PESO);
  const length = Math.round(ladoLargo * RATIO_LARGO);
  const width  = Math.round(ladoCorto * RATIO_ANCHO);
  const height = Math.round(ladoCorto * RATIO_ALTO);

  if (weight > PESO_MAXIMO) {
    throw new Error(
      `El peso calculado (${weight}g) supera el límite de la API (${PESO_MAXIMO}g). Reducí las dimensiones.`
    );
  }

  if (length > DIMENSION_MAXIMA) {
    throw new Error(
      `El largo del paquete calculado (${length}cm) supera el límite de la API (${DIMENSION_MAXIMA}cm).`
    );
  }

  if (width > DIMENSION_MAXIMA) {
    throw new Error(
      `El ancho del paquete calculado (${width}cm) supera el límite de la API (${DIMENSION_MAXIMA}cm).`
    );
  }

  if (height > DIMENSION_MAXIMA) {
    throw new Error(
      `El alto del paquete calculado (${height}cm) supera el límite de la API (${DIMENSION_MAXIMA}cm).`
    );
  }

  return { weight, length, width, height };
};
