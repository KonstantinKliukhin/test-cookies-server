import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import { UAParser } from 'ua-parser-js';
type Product = { id: string; title: string };

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('set-cookies')
  setLocalhostChromeCookies(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const isLocal = req
      .header('origin')
      .startsWith('http://local.my-test-domain.xyz');
    const browserName = UAParser(req.header('user-agent')).browser.name;

    const isSafari = browserName === 'Safari';

    if (isLocal && isSafari) {
      res.cookie('local-safari-cookie', '123123', {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 10000),
        domain: 'my-test-domain.xyz',
        path: '/',
      });
    } else if (isLocal) {
      res.cookie('local-cookie', '123123', {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 10000),
        domain: 'my-test-domain.xyz',
        path: '/',
        sameSite: 'none',
        secure: true,
      });
    } else {
      res.cookie('prod-cookie', '123123', {
        sameSite: 'none',
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 10000),
        secure: true,
        domain: 'my-test-domain.xyz',
        path: '/',
      });
    }

    return { isLocal, isSafari };
  }

  @Get('my-cookies')
  getCookies(@Req() req: Request) {
    console.log('req.cookies: ', req.cookies);

    return { cookies: req.cookies };
  }

  @Get('products')
  getProducts(): Product[] {
    console.log('GET PRODUCTS');
    return Array.from({ length: 40 })
      .fill(null)
      .map((_, index) => ({
        id: String(index),
        title: `Product: ${index}`,
      }));
  }

  @Get('products/:id')
  getProduct(@Param('id') id: string): Product {
    console.log(`GET PRODUCT ${id} REQUEST HIT`);

    return { id: id, title: `Product: ${id}` };
  }
}
