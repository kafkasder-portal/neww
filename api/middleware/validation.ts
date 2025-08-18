import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateRequest = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: ValidationError[] = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        return res.status(400).json({
          error: 'Validation failed',
          details: validationErrors
        });
      }

      // For other types of errors
      return res.status(400).json({
        error: 'Validation error',
        message: error instanceof Error ? error.message : 'Unknown validation error'
      });
    }
  };
};

export const validateQuery = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.query);
      req.query = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: ValidationError[] = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        return res.status(400).json({
          error: 'Query validation failed',
          details: validationErrors
        });
      }

      return res.status(400).json({
        error: 'Query validation error',
        message: error instanceof Error ? error.message : 'Unknown validation error'
      });
    }
  };
};

export const validateParams = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.params);
      req.params = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: ValidationError[] = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        return res.status(400).json({
          error: 'Parameter validation failed',
          details: validationErrors
        });
      }

      return res.status(400).json({
        error: 'Parameter validation error',
        message: error instanceof Error ? error.message : 'Unknown validation error'
      });
    }
  };
};

export default {
  validateRequest,
  validateQuery,
  validateParams
};
