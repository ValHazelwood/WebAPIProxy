namespace HDRezka.Types
{
    public class SeasonsData
    {
        public int CurrentSeason { get; set; }

        public int CurrentEpisode { get; set; }

        public Season[] Seasons { get; set; }

        public CDNStream[] CDNStreams { get; set; }
    }
}
