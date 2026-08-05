# 10 — Traducir técnico a negocio (sin perder precisión)

## Por qué esto se evalúa en la entrevista

El JD dice: "traducir requerimientos técnicos a lenguaje de negocio en la
comunicación con el equipo del cliente". No es una competencia blanda
decorativa — es la diferencia entre un contractor que el cliente renueva y
uno que no, porque el cliente necesita ENTENDER en qué está gastando el
presupuesto.

## El error común: jerga sin traducir

> "Vamos atrasados porque había mucho acoplamiento y cero cobertura de
> tests, así que estamos escribiendo characterization tests antes del
> refactor."

Técnicamente correcto. Para un Product Owner no técnico, es ruido — no
sabe si eso es grave, cuánto va a tardar, ni qué implica para el negocio.

## La traducción que sí funciona

> "El código actual no tiene una red de seguridad: si cambiamos algo sin
> antes verificar qué hace HOY, podemos romper algo en producción sin
> darnos cuenta hasta que un cliente final lo reporte. Por eso primero
> escribimos pruebas que capturen el comportamiento actual — así,
> cualquier cambio que hagamos después, si rompe algo, nos avisa a
> NOSOTROS antes de llegar a producción, no al revés. Esto agrega ~2 días
> al estimado original, pero baja mucho el riesgo de un incidente en el
> módulo de emisión, que es el que más plata mueve."

La estructura que funciona, siempre:

1. **Riesgo concreto en términos de negocio** (no "bug", sino "puede
   romper algo que un cliente final ve").
2. **Qué estás haciendo al respecto**, en una frase, sin nombrar
   herramientas a menos que pregunten.
3. **Impacto en tiempo/alcance**, con un número, no "un poco más".
4. **Por qué vale la pena** ese costo (conectado a lo que le importa al
   negocio: menos incidentes, más velocidad futura, etc.)

## Mentoría a un dev Mid/Junior: mismo principio, distinto público

Con el equipo técnico, sí vale explicar el mecanismo (por qué un `any`
esconde un bug, por qué un nested subscribe leaksea) — pero la estructura
es la misma: riesgo concreto → qué hacer → por qué. La diferencia con el
cliente no técnico es el VOCABULARIO, no el rigor.

## Práctica

`app/src/app/features/live-coding/` — el tercer brief ("El cliente
pregunta por qué el refactor tarda más") es exactamente este ejercicio,
cronometrado.
