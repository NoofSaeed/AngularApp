namespace ASP.NETCore.API.SignalRModels
{
    public interface IHubClient
    {
        Task  BroadcastMessage();

    }
}
