// A small well-formedness check for SVG strings: every tag closes in order,
// attributes are quoted, nothing says NaN or undefined.

const VOID = new Set(["input", "br", "img", "hr", "meta", "link"]);

export function assertWellFormed(svg, assert, what = "svg") {
  const stack = [];
  for (const match of svg.matchAll(/<(\/?)([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g)) {
    const [, closing, name, attrs, selfClosing] = match;
    assert.ok(!/=\s*[^"\s]/.test(attrs.replace(/="[^"]*"/g, "")), `${what}: unquoted attribute in <${name}${attrs}>`);
    assert.ok(!/NaN|undefined|Infinity/.test(attrs), `${what}: bad value in <${name}${attrs.slice(0, 80)}>`);
    if (selfClosing || VOID.has(name.toLowerCase())) continue;
    if (closing) assert.equal(stack.pop(), name, `${what}: </${name}> closes the wrong tag`);
    else stack.push(name);
  }
  assert.deepEqual(stack, [], `${what}: unclosed tags`);
}

export function idsIn(svg) {
  return [...svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
}
