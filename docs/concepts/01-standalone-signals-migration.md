# 01 — De NgModule + `@Input` a Standalone + Signals

## El código legacy (lo que vas a encontrar en la entrevista)

```ts
@Component({
  selector: 'app-policy-detail',
  templateUrl: './policy-detail.component.html',
})
export class PolicyDetailComponent implements OnChanges {
  @Input() policyId: string;
  policy: any;

  constructor(private policyService: PolicyService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['policyId']) {
      this.policyService.getPolicy(this.policyId).subscribe(p => (this.policy = p));
    }
  }
}
```

Funciona. Pero tiene tres problemas que un entrevistador senior espera que
notes sin que se los señalen:

1. **`ngOnChanges` + subscribe manual** es un mecanismo imperativo para algo
   que es, por naturaleza, reactivo: "cuando cambia `policyId`, quiero el
   `policy` correspondiente". Cada subscribe manual es una oportunidad de
   olvidarse el unsubscribe.
2. **`any`** apaga el type-checking justo donde más lo necesitás: el
   resultado de un HTTP call.
3. Si `policyId` cambia rápido (el usuario navega rápido entre pólizas), no
   hay cancelación del request anterior — puede llegar tarde y pisar el dato
   correcto con uno viejo (race condition).

## Por qué pasa

`@Input` + `ngOnChanges` es el modelo de Angular pre-Signals: el framework
te avisa "algo cambió", y vos decidís manualmente qué hacer. No hay
composición declarativa entre "esto cambió" y "por lo tanto esto se
recalcula" — la tenés que programar vos, cada vez, y es fácil hacerlo mal
(como en el ejemplo, que ni siquiera cancela el request anterior).

## El concepto

Un **signal de input** (`input.required<T>()`) convierte el input en un
valor reactivo de solo lectura. Combinado con `resource()` (o `rxResource()`
si tu fuente de datos es un Observable existente), obtenés una cadena
completamente declarativa: "el recurso se recarga solo cuando cambia su
signal de entrada", con cancelación automática del request en vuelo
incluida.

## El fix

```ts
import { Component, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-policy-detail',
  templateUrl: './policy-detail.component.html',
})
export class PolicyDetail {
  private readonly policyService = inject(PolicyService);

  readonly policyId = input.required<string>();

  protected readonly policy = rxResource({
    params: () => this.policyId(),
    stream: ({ params }) => this.policyService.getPolicy(params),
  });
}
```

En el template: `policy.isLoading()`, `policy.error()`, `policy.value()` —
loading/error/data ya modelados, sin banderas booleanas manuales.

## Cuándo NO alcanza con esto

Si `policy` necesita persistir mientras el usuario navega a OTRA ruta y
volver (ej. un wizard multi-paso), un signal/resource con scope de
componente se pierde al destruirse el componente. Ahí corresponde un
servicio con scope de ruta (`Route.providers`) o de feature, no un signal
local — ver `04-legacy-ngmodule-interop.md` para el criterio de scope de
providers.

## Práctica

`app/src/app/features/lab/policy-list/` — mismo patrón, aplicado a una
lista con feed en vivo en vez de un detalle por id.
