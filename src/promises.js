module.exports = (...initArgs) => {
	let api;

	return new Promise((res) => {
		api = require("./robinhood")(...initArgs, res);
	}).then(() => {
		// relies on the last param of each func of api as being a cb
		// relies on the last param of cb as being result/body that will be resolved
		// relies on the first param of cb as being err that will reject if !nullish
		Object.keys(api).forEach((key) => {
			const val = api[key];

			// skip private names and non funcs that may happen to exist on api object
			// skip non-callback funcs (manually)
			if (
				typeof val !== "function" ||
				key[0] === "_" ||
				key === "auth_token"
			)
				return;

			api[key] = (...args) =>
				new Promise((res, rej) => {
					val(...args, (err, ...rest) =>
						err ||
						rest[0].request.response.statusCode < 200 ||
						rest[0].request.response.statusCode > 399
							? rej(
									err ||
										new Error(
											`HTTP ${rest[0].request.response.statusCode}: ${rest[0].request.response.statusMessage}`
										)
							  )
							: res(rest[rest.length - 1])
					);
				});
		});

		return api;
	});
};
