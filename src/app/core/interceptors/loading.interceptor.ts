import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { ConverterService } from '../services/converter.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const converter = inject(ConverterService);

  // Only engage loading indicator for conversion endpoints
  const isConversion = req.url.includes('/convert/');
  if (!isConversion) return next(req);

  return next(req).pipe(
    finalize(() => converter.isConverting.set(false))
  );
};
