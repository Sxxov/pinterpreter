/* eslint-env browser, node */
Object.defineProperty(navigator, 'languages', {
	get: () => ['en-US', 'en'],
});

Object.defineProperty(navigator, 'plugins', {
	get: () => [1, 2, 3, 4, 5],
});

const { getParameter } = WebGLRenderingContext;
WebGLRenderingContext.prototype.getParameter = (parameter) => {
	// UNMASKED_VENDOR_WEBGL
	if (parameter === 37445) {
		return 'Google Inc.';
	}
	// UNMASKED_RENDERER_WEBGL
	if (parameter === 37446) {
		return 'ANGLE (Intel(R) UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0)';
	}

	return getParameter(parameter);
};
