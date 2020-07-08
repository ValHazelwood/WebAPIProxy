namespace HDRezka.Types
{
    public class CDNSeriesRequest : MediaRequest
    {
        public int? Season { get; set; }

        public int? Episode { get; set; }
    }
}
