import QueueContructModel from '../models/server-manager.model';

class QueueService {
    private static instance: QueueService;
    queue: Map<string, QueueContructModel>;

    private constructor() {
        this.queue = new Map<string, QueueContructModel>();
    }

    public static getInstance(): QueueService {
        if (!QueueService.instance) {
            QueueService.instance = new QueueService();
        }

        return QueueService.instance;
    }

    get(id: string): QueueContructModel | undefined {
        return this.queue.get(id);
    }

    set(id: string, queueContruct: QueueContructModel): void {
        this.queue.set(id, queueContruct);
    }

    disconnect(id: string): void {
        this.queue.disconnect(id);
    }
}

export default QueueService;
