import { server as WebSocketServer, connection } from 'websocket';
import { createServer, Server as HttpServer } from 'http';
import express, { Application } from 'express';

let wsServer: WebSocketServer | null = null;

export const initializeWebSocket = (server: HttpServer) => {
    wsServer = new WebSocketServer({ httpServer: server });

    wsServer.on('request', (request) => {
        const wsConnection: connection = request.accept(null, request.origin);
        console.log('New WebSocket client connected');

        wsConnection.on('close', () => console.log('Client disconnected'));
        wsConnection.on('error', (err) => console.error('WebSocket error:', err.message));
    });
};

export const broadcast = (data: object) => {
    if (wsServer) {
        wsServer.connections.forEach(client => {
            client.sendUTF(JSON.stringify(data));
        });
    }
};
