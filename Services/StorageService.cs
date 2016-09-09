using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Queue;

public interface IStorageService
{
    Task Enqueue(string message);
}

public class StorageService:IStorageService{
    private CloudQueue queue;
        public StorageService(string connstring){
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connstring);
            CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();
            queue = queueClient.GetQueueReference("twitter");
        }
        
        public async Task Enqueue(string message){
            await queue.AddMessageAsync(new CloudQueueMessage(message));
        }
    
}