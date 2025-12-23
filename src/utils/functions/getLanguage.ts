export const getLanguage = (code: string): string => {
    const trimmedCode = code.trim();
    if (!trimmedCode) return 'text';

    const lines = trimmedCode.split('\n');
    const firstLine = lines[0].trim();
    const hasTypes = trimmedCode.includes(': string') || trimmedCode.includes(': number') || trimmedCode.includes(': boolean') || trimmedCode.includes(': any') || trimmedCode.includes(': unknown');
    const hasInterfaces = trimmedCode.includes('interface ') || trimmedCode.includes('type ') || trimmedCode.includes('enum ');

    if (firstLine.startsWith('#!')) {
        if (firstLine.includes('python')) return 'python';
        if (firstLine.includes('node') || firstLine.includes('js')) return 'javascript';
        if (firstLine.includes('bash') || firstLine.includes('sh')) return 'bash';
    }

    if (
        trimmedCode.includes('className=') ||
        trimmedCode.includes('ref=') ||
        trimmedCode.includes('key=') ||
        trimmedCode.includes('useState') ||
        trimmedCode.includes('useEffect') ||
        (trimmedCode.includes('</') && trimmedCode.includes('>')) ||
        (trimmedCode.match(/<[^>]+>/g)?.length || 0) > 2 ||
        trimmedCode.includes('React.')
    ) {
        if (hasTypes || hasInterfaces) return 'tsx';
        return 'jsx';
    }

    if (
        hasTypes ||
        hasInterfaces ||
        trimmedCode.includes('declare ') ||
        trimmedCode.includes('as const') ||
        trimmedCode.includes('satisfies ') ||
        trimmedCode.includes('readonly ') ||
        trimmedCode.includes('Partial<')
    ) {
        return 'typescript';
    }

    if (
        lines.some(line =>
            line.includes('=>') ||
            line.includes('const ') ||
            line.includes('let ') ||
            line.includes('var ') ||
            line.includes('async ') ||
            line.includes('await ') ||
            line.includes('function ') ||
            trimmedCode.includes('module.exports')
        )
    ) {
        return 'javascript';
    }

    if (trimmedCode.startsWith('{') && trimmedCode.endsWith('}') && trimmedCode.includes('":') && trimmedCode.includes(',')) {
        return 'json';
    }

    if (
        trimmedCode.includes('<html') ||
        trimmedCode.includes('<!DOCTYPE') ||
        trimmedCode.includes('<head>') ||
        trimmedCode.includes('<body>') ||
        (trimmedCode.match(/<[^>/]+>/g)?.length || 0) > 3
    ) {
        return 'xml';
    }

    if (
        lines.some(line =>
            line.includes(':') &&
            (line.includes('{') || line.includes('}')) &&
            !line.includes('function') &&
            !line.includes('const') &&
            !line.includes('=>')
        ) ||
        trimmedCode.includes('background:') ||
        trimmedCode.includes('color:') ||
        trimmedCode.includes('font-size:') ||
        trimmedCode.includes('display:') ||
        trimmedCode.includes('position:')
    ) {
        if (trimmedCode.includes('@use') || trimmedCode.includes('@import') || trimmedCode.includes('$') || trimmedCode.includes('@mixin')) return 'scss';
        return 'css';
    }

    if (
        lines.some(line =>
            line.includes('def ') ||
            line.includes('import ') ||
            line.includes('from ') ||
            line.includes('class ') ||
            line.includes('print(') ||
            line.includes('if __name__')
        )
    ) {
        return 'python';
    }

    if (
        lines.some(line =>
            line.includes('public ') ||
            line.includes('private ') ||
            line.includes('protected ') ||
            line.includes('static ') ||
            line.includes('void ') ||
            line.includes('int ')
        )
    ) {
        return 'java';
    }

    if (
        lines.some(line =>
            line.includes('#include') ||
            line.includes('#define') ||
            line.includes('int main') ||
            line.includes('std::') ||
            (trimmedCode.includes('using ') && trimmedCode.includes(';'))
        )
    ) {
        if ((trimmedCode.includes('using ') && trimmedCode.includes('namespace')) ||
            (trimmedCode.includes('class ') && trimmedCode.includes('{'))) {
            return 'csharp';
        }
        return 'cpp';
    }

    if (trimmedCode.includes('<?php') || lines.some(line => line.includes('function ') && line.includes('$')) || trimmedCode.includes('$this')) {
        return 'php';
    }

    if (lines.some(line => line.includes('def ') && !line.includes('(') && line.includes('end'))) {
        return 'ruby';
    }

    if (lines.some(line => line.includes('package ') || line.includes('import (') || line.includes('func '))) {
        return 'go';
    }

    if (lines.some(line => line.includes('fn ') || line.includes('mod ') || line.includes('use ') || line.includes('struct '))) {
        return 'rust';
    }

    if (lines.some(line => line.match(/\b(INSERT|SELECT|UPDATE|DELETE|CREATE|ALTER|FROM|WHERE|JOIN|TABLE)\b/i))) {
        return 'sql';
    }

    if (
        trimmedCode.includes('```') ||
        trimmedCode.match(/#{1,6}\s/g) ||
        lines.some(line => line.startsWith('>') || line.match(/^\s*[-*+]\s/) || line.match(/^\s*\d+\.\s/)) ||
        trimmedCode.includes('**') ||
        trimmedCode.includes('[[')
    ) {
        return 'markdown';
    }

    if (
        trimmedCode.includes(':') &&
        !trimmedCode.includes('{') &&
        !trimmedCode.includes('function') &&
        lines.some(line => line.match(/^\s*-/) || line.match(/^\s*\d+:/))
    ) {
        return 'yaml';
    }

    if (
        lines.some(line =>
            line.includes('$ ') ||
            firstLine.startsWith('#!/bin') ||
            trimmedCode.includes('export ') ||
            trimmedCode.includes('cd ') ||
            trimmedCode.includes('| grep')
        )
    ) {
        return 'bash';
    }

    return trimmedCode.includes(';') ? 'plaintext' : 'javascript';
};