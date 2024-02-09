import { Body, Controller, Post, Param, UsePipes, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { CheckoutService } from '../../../core/applications/services/checkout.service';
import { 
    GerarQrCodeDto
} from './checkout.dto';
import { QrCodeGenResponse, FakeCheckoutResponse } from "../../../core/applications/ports/checkout.interface";

@Controller('checkout')
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true, 
  forbidNonWhitelisted: true 
})) 
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('/createQr')
  async create(@Body() createQrCodeDto: GerarQrCodeDto): Promise<QrCodeGenResponse> {
    return await this.checkoutService.gerarQrCodePix(createQrCodeDto);
  }

  @Post('/pay')
  async checkout(@Param('eventId') orderId: string): Promise<FakeCheckoutResponse> {
    return await this.checkoutService.fakeCheckout(
      {
        orderId: orderId
      }
    );
  }

}
