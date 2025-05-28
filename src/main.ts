async function main() {
    // 1. Check for WebGPU support
    if (!navigator.gpu) {
        throw new Error("WebGPU not supported on this browser.");
    }
    console.log("WebGPU is supported.");

    // 2. Request a GPUAdapter
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        throw new Error("No appropriate GPUAdapter found.");
    }
    console.log("GPUAdapter obtained.");

    // 3. Request a GPUDevice
    const device = await adapter.requestDevice();
    if (!device) {
        throw new Error("No GPUDevice found.");
    }
    console.log("GPUDevice obtained.");

    // 4. Get the canvas element
    const canvas = document.getElementById('webgpu-canvas') as HTMLCanvasElement;
    if (!canvas) {
        throw new Error("Could not find canvas element with id 'webgpu-canvas'.");
    }
    console.log("Canvas element obtained.");

    // 5. Get GPUCanvasContext
    const context = canvas.getContext('webgpu');
    if (!context) {
        throw new Error("Could not get WebGPU context from canvas.");
    }
    console.log("GPUCanvasContext obtained.");

    // 6. Configure the canvas context
    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device: device,
        format: canvasFormat,
        alphaMode: 'opaque' // Or 'premultiplied' if transparency is needed later
    });
    console.log(`Canvas configured with format: ${canvasFormat}`);

    // Task 4: Clear Screen
    // Get the current texture from the canvas context
    const canvasTexture = context.getCurrentTexture();
    const textureView = canvasTexture.createView();

    // Create a command encoder
    const commandEncoder = device.createCommandEncoder();

    // Start a render pass
    const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [
            {
                view: textureView,
                clearValue: { r: 1.0, g: 0.75, b: 0.8, a: 1.0 }, // HotPink
                loadOp: 'clear',
                storeOp: 'store',
            },
        ],
    };
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.end(); // End the render pass

    // Submit the command buffer to the device queue
    const commandBuffer = commandEncoder.finish();
    device.queue.submit([commandBuffer]);

    console.log("Canvas cleared to HotPink. WebGPU setup complete!");
}

main().catch(err => {
    console.error(err);
    const errorDisplay = document.createElement('p');
    errorDisplay.textContent = `Error: ${err.message}`;
    errorDisplay.style.color = 'red';
    document.body.appendChild(errorDisplay);
});
