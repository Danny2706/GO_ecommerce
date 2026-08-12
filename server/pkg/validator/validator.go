package validator

import (
	"errors"

	"github.com/go-playground/validator/v10"
)

// FormatValidationError formats gin request binding validation errors into readable strings.
// Go Concept: Type Assertions & Error Handling
func FormatValidationError(err error) string {
	var ve validator.ValidationErrors
	if errors.As(err, &ve) {
		if len(ve) > 0 {
			fe := ve[0]
			switch fe.Tag() {
			case "required":
				return fe.Field() + " is required"
			case "email":
				return fe.Field() + " must be a valid email address"
			case "min":
				return fe.Field() + " must be at least " + fe.Param() + " characters"
			case "max":
				return fe.Field() + " must not exceed " + fe.Param() + " characters"
			case "gt":
				return fe.Field() + " must be greater than " + fe.Param()
			default:
				return fe.Field() + " is invalid"
			}
		}
	}
	return err.Error()
}
