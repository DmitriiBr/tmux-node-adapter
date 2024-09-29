const { describe, it } = require("node:test")
const assert = require("node:assert/strict")
const TmuxBlockBuilder = require("../src/TmuxBlockBuilder")

describe("TmuxBlockBuilder", () => {
    it("Should append #000 foreground modifier", (t) => {
        const tmuxBlockBuilder = new TmuxBlockBuilder()
        const block = tmuxBlockBuilder.foreground("#000").create()

        const expected = `#[fg=#000]`

        assert.strictEqual(block, expected)
    })

    it("Should append #000 background modifier", (t) => {
        const tmuxBlockBuilder = new TmuxBlockBuilder()
        const block = tmuxBlockBuilder.background("#000").create()

        const expected = `#[bg=#000]`

        assert.strictEqual(block, expected)
    })

    it("Should append bold modifier", (t) => {
        const tmuxBlockBuilder = new TmuxBlockBuilder()
        const block = tmuxBlockBuilder.bold().create()

        const expected = `#[bold]`

        assert.strictEqual(block, expected)
    })

    it("Should append #000 foreground, #fff background and bold modifiers", (t) => {
        const tmuxBlockBuilder = new TmuxBlockBuilder()
        const block = tmuxBlockBuilder
            .foreground("#000")
            .background("#fff")
            .bold()
            .create()

        const expected = `#[fg=#000,bg=#fff,bold]`

        assert.strictEqual(block, expected)
    })

    it("Should throw TypeError with 'foreground was already declared'", (t) => {
        const tmuxBlockBuilder = new TmuxBlockBuilder()
        const fn = tmuxBlockBuilder
            .foreground("#000")
            .foreground.bind(tmuxBlockBuilder)

        const message = '"foreground" was already declared'

        assert.throws(fn, {
            name: "TypeError",
            message,
        })
    })

    it("Should throw TypeError with 'background was already declared'", (t) => {
        const tmuxBlockBuilder = new TmuxBlockBuilder()
        const fn = tmuxBlockBuilder
            .background("#000")
            .background.bind(tmuxBlockBuilder)

        const message = '"background" was already declared'

        assert.throws(fn, {
            name: "TypeError",
            message,
        })
    })

    it("Should throw TypeError with 'bold was already declared'", (t) => {
        const tmuxBlockBuilder = new TmuxBlockBuilder()
        const fn = tmuxBlockBuilder.bold().bold.bind(tmuxBlockBuilder)

        const message = '"bold" was already declared'

        assert.throws(fn, {
            name: "TypeError",
            message,
        })
    })

    it("Should throw TypeError with 'foreground with empty value cannot be defined'", (t) => {
        const tmuxBlockBuilder = new TmuxBlockBuilder()
        const fn = tmuxBlockBuilder.foreground.bind(tmuxBlockBuilder)

        const message = '"foreground" with empty value cannot be defined'

        assert.throws(fn, {
            name: "TypeError",
            message,
        })
    })

    it("Should throw TypeError with 'background with empty value cannot be defined'", (t) => {
        const tmuxBlockBuilder = new TmuxBlockBuilder()
        const fn = tmuxBlockBuilder.background.bind(tmuxBlockBuilder)

        const message = '"background" with empty value cannot be defined'

        assert.throws(fn, {
            name: "TypeError",
            message,
        })
    })

    it('Should throw TypeError with \'"foreground" should be "string" type\'', (t) => {
        const tmuxBlockBuilder = new TmuxBlockBuilder()
        const fn = tmuxBlockBuilder.foreground.bind(tmuxBlockBuilder, {
            field: "test",
        })

        const message = '"foreground" should be "string" type'

        assert.throws(fn, {
            name: "TypeError",
            message,
        })
    })

    it('Should throw TypeError with \'"background" should be "string" type\'', (t) => {
        const tmuxBlockBuilder = new TmuxBlockBuilder()
        const fn = tmuxBlockBuilder.background.bind(tmuxBlockBuilder, {
            field: "test",
        })

        const message = '"background" should be "string" type'

        assert.throws(fn, {
            name: "TypeError",
            message,
        })
    })
})
