namespace HDRezka.Types
{
    public class CDNSeriesRequest : EpisodesRequest
    {
        public int? Season { get; set; }

        public int? Episode { get; set; }
    }
}
