import Joi from 'joi';
const userSignUpValidationSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] }
    })
    .messages({
      'string.email': `Please provide a valid email.`,
      'string.base': 'Please provide a valid email.',
      'string.empty': 'Please provide a valid email.',
      'any.invalid': 'Please provide a valid email.'
    })
    .required(),
  first_name: Joi.string()
    .pattern(new RegExp("[a-zA-Z'-\\s]+$"))
    .required()
    .min(3)
    .max(30)
    .messages({
      'string.base': `Please enter your first name. It can only contain [a-z, A-Z, ' and -].`,
      'string.empty': "Please enter your first name. It can only contain [a-z, A-Z, ' and -].",
      'any.invalid': `Please enter your first name. It can only contain [a-z, A-Z, ' and -].`,
      'string.pattern.base': `Please enter your first name. It can only contain [a-z, A-Z, ' and -].`
    }),
  last_name: Joi.string()
    .pattern(new RegExp("[a-zA-Z'-\\s]+$"))
    .required()
    .min(3)
    .max(30)
    .messages({
      'string.base': `Please enter your last name. It can only contain [a-z, A-Z, ' and -].`,
      'string.empty': "Please enter your last name. It can only contain [a-z, A-Z, ' and -].",
      'any.invalid': `Please enter your last name. It can only contain [a-z, A-Z, ' and -].`,
      'string.pattern.base': `Please enter your last name. It can only contain [a-z, A-Z, ' and -].`
    }),
  display_name: Joi.string()
    .pattern(new RegExp("[a-zA-Z0-9'-\\s]+$"))
    .optional()
    .min(3)
    .max(30)
    .messages({
      'string.base': `Please enter your display name. It can only contain [a-z, A-Z, ' and -].`,
      'string.empty': "Please enter your display name. It can only contain [a-z, A-Z, ' and -].",
      'any.invalid': `Please enter your display name. It can only contain [a-z, A-Z, ' and -].`,
      'string.pattern.base': `Display name can only include [a-z, A-Z, and 0-9]`
    }),
  date_of_birth: Joi.date().optional().iso().max('2013-12-31').messages({
    'date.base': 'Invalid date format.',
    'date.max': 'Please provide a valid date of birth. It can not be later than 31-12-2013.',
    'any.invalid': 'Invalid date format.',
    'any.only': 'Invalid date of birth.'
  }),
  password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Password must be between 8 and 30 characters long and include at least one of [a-z, A-Z, 0-9]',
      'string.base': `Password can only be a string.`
    }),
  password_confirm: Joi.valid(Joi.ref('password')).messages({
    'any.only': 'Passwords do not match. Please make sure the passwords match.'
  })
});

const updatePasswordSchema = Joi.object({
  password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Password must be between 8 and 30 characters long and include at least one of [a-z, A-Z, 0-9]'
    }),
  password_confirm: Joi.valid(Joi.ref('password')).messages({
    'any.only': 'Passwords do not match. Please make sure the passwords match.'
  }),
  password_current: Joi.string().required().messages({
    'string.base': 'Please provide your current password.',
    'string.empty': 'Please provide your current password.'
  })
});

const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Password must be between 8 and 30 characters long and include at least one of [a-z, A-Z, 0-9]'
    }),
  password_confirm: Joi.valid(Joi.ref('password')).messages({
    'any.only': 'Passwords do not match. Please make sure the passwords match.'
  })
});

export { userSignUpValidationSchema, updatePasswordSchema, resetPasswordSchema };
