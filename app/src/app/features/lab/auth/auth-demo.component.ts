import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TokenStore } from './token-store';

@Component({
  selector: 'app-auth-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButtonModule],
  templateUrl: './auth-demo.component.html',
})
export class AuthDemo {
  protected readonly tokenStore = inject(TokenStore);

  protected simulateLogin(): void {
    this.tokenStore.setTokens('demo-access-token', 'demo-refresh-token');
  }

  protected logout(): void {
    this.tokenStore.clear();
  }
}
