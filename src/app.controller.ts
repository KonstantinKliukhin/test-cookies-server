import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';

type Product = { id: string; title: string };

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('set-cookies')
  getCookie(@Res({ passthrough: true }) res: Response) {
    res.cookie('custom-cookie', '123123', {
      sameSite: 'none',
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 10000),
      secure: true,
      domain: '.my-test-domain.xyz',
      path: '/',
    });

    return { some: true };
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
