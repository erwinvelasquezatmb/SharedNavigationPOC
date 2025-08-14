using System.Text.Json;
//using FluentValidation;

namespace Anytime.Phone.Middleware;
public class ExceptionHandlingMiddleware
{
	private readonly RequestDelegate _next;
	private readonly ILogger<ExceptionHandlingMiddleware> _logger;

	public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
	{
		_next = next ?? throw new ArgumentNullException(nameof(next));
		_logger = logger ?? throw new ArgumentNullException(nameof(logger));
	}

	public async Task Invoke(HttpContext context)
	{
		try
		{
			await _next(context);
		}
		//catch (ValidationException vex)
		//{
		//    await HandleValidationException(context, vex).ConfigureAwait(false);
		//}
		//catch (ArgumentNullException anex)
		//{
		//    await HandleArgumentException(context, anex).ConfigureAwait(false);
		//}
		//catch (InvalidOperationException ioex)
		//{
		//    await HandleInvalidOperationException(context, ioex).ConfigureAwait(false);
		//}
		catch (Exception ex)
		{
			await HandleGenericException(context, ex).ConfigureAwait(false);
		}
	}

	//private async Task HandleValidationException(HttpContext context, ValidationException vex)
	//{
	//	_logger.LogWarning(vex, "Validation exception occurred");

	//	context.Response.ContentType = "application/json";
	//	context.Response.StatusCode = StatusCodes.Status400BadRequest;

	//	var errors = vex.Errors.Select(e => new
	//	{
	//		code = string.IsNullOrEmpty(e.ErrorCode) ? CommonErrors.ValidationError.Code : e.ErrorCode,
	//		message = e.ErrorMessage
	//	});

	//	var response = new
	//	{
	//		success = false,
	//		errors = errors
	//	};

	//	await WriteJsonResponse(context, response).ConfigureAwait(false);
	//}

	//private async Task HandleArgumentException(HttpContext context, ArgumentNullException anex)
	//{
	//	_logger.LogError(anex, "Argument null exception occurred");

	//	context.Response.ContentType = "application/json";
	//	context.Response.StatusCode = StatusCodes.Status400BadRequest;

	//	var response = new
	//	{
	//		success = false,
	//		errors = new[]
	//		{
	//			new
	//			{
	//				code = CommonErrors.InvalidParameters.Code,
	//				message = CommonErrors.InvalidParameters.Message
	//			}
	//		}
	//	};

	//	await WriteJsonResponse(context, response).ConfigureAwait(false);
	//}

	//private async Task HandleInvalidOperationException(HttpContext context, InvalidOperationException ioex)
	//{
	//	_logger.LogError(ioex, "Invalid operation exception occurred");

	//	context.Response.ContentType = "application/json";
	//	context.Response.StatusCode = StatusCodes.Status422UnprocessableEntity;

	//	var response = new
	//	{
	//		success = false,
	//		errors = new[]
	//		{
	//			new
	//			{
	//				code = CommonErrors.InvalidOperation.Code,
	//				message = CommonErrors.InvalidOperation.Message
	//			}
	//		}
	//	};

	//	await WriteJsonResponse(context, response).ConfigureAwait(false);
	//}

	private async Task HandleGenericException(HttpContext context, Exception ex)
	{
		_logger.LogError(ex, "Unhandled exception occurred");

		context.Response.ContentType = "application/json";
		context.Response.StatusCode = StatusCodes.Status500InternalServerError;

		var response = new
		{
			success = false,
			errors = new[]
			{
				new
				{
					code = "ER001",
					message = "Message"
				}
			}
		};

		await WriteJsonResponse(context, response).ConfigureAwait(false);
	}

	private static async Task WriteJsonResponse(HttpContext context, object response)
	{
		var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
		{
			PropertyNamingPolicy = JsonNamingPolicy.CamelCase
		});

		await context.Response.WriteAsync(json).ConfigureAwait(false);
	}
}
